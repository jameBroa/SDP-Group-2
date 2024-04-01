from db import upload_video
import camera
import globals
import cv2
import subprocess
import time
import threading
import asyncio
from thresh import Tracker
from thresh import ROI
import os
import masterControlProgram



async def record():
	try:
		globals.uploaded_video = False
		print('getting here')
		
		file_path = f'/home/pi/Desktop/videos/{globals.current_user}/{globals.session_id}'
		if not os.path.exists(file_path):
			os.makedirs(file_path)		
		video_path = f"{file_path}/{globals.video_count}.avi"
		
		lift = masterControlProgram.Lift(solenoid_speed=190,dc_motor_speed=30, video_path=video_path)
		lift.mainloop()
		lift.flush()
		lift.close()
		
		upload_video(f"{file_path}/{globals.video_count}.avi")
		globals.uploaded_video = True
		
		globals.video_count += 1
	except Exception as e:
		print(e)


def start():
	print("\n- RUNNING PROGRAM")	
	
	# while either session is in progress or video has not been uploaded
	while globals.session_in_progress:
		try:
			print(f"Trying to record video number: {globals.video_count}")
			asyncio.run(record())
		except Exception as e:
			print(f"Exception: {e}")
			raise RuntimeError("Problem with record and upload, aborting")
