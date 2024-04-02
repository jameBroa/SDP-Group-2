from db import upload_video
import camera
import globals
import cv2
import subprocess
import time
import threading
import asyncio
from thresh import Tracker, ROI
from flask_socketio import emit
import os
import masterControlProgram



async def record():
	try:
		globals.uploaded_video = False
		print('getting here')
		
		# Make path for file to be saved locally
		file_path = f'/home/pi/Desktop/videos/{globals.current_user[globals.whose_turn]}/{globals.session_id}'
		if not os.path.exists(file_path):
			os.makedirs(file_path)		
		video_path = f"{file_path}/{globals.video_count}.avi"
		
		# Control loop
		lift = masterControlProgram.Lift(solenoid_speed=190,dc_motor_speed=30, video_path=video_path)
		lift.mainloop()
		lift.flush()
		lift.close()
		
		# Upload video that was saved to Desktop
		upload_video(f"{file_path}/{globals.video_count}.avi")
		globals.uploaded_video = True
		
		globals.video_count += 1
		
		# If group session, stop after 2 videos were uploaded i.e. 2 putts were made
		if globals.session_type == "group" and globals.video_count % 2 == 0:
			break
	except Exception as e:
		print(e)


def start():
	print("\n- RUNNING PROGRAM")	
	
	# While session is in progress
	while globals.session_in_progress:
		
		try:
			print(f"Trying to record video number: {globals.video_count}")
			asyncio.run(record())
			
			# This means we broke out of record, so it must be another player's turn
			if globals.session_type == "group":
				globals.whose_turn += 1
				emit("group_game_whose_turn", {'user_id': globals.users[globals.whose_turn]}, broadcast=True)
			
		except Exception as e:
			print(f"Exception: {e}")
			raise RuntimeError("Problem with record and upload, aborting")
