from db import upload_video
import camera
import globals
import cv2
import subprocess
import time
import threading
import asyncio
#from tracker import Tracker
from thresh import Tracker
from thresh import ROI
import os


async def record():
	try:
		globals.uploaded_video = False
		print('getting here')
		
		file_path = f'/home/pi/Desktop/videos/{globals.current_user}/{globals.session_id}'
		if not os.path.exists(file_path):
			os.makedirs(file_path)
			
			
		tracker = Tracker(output_path=f"{file_path}/{globals.video_count}.avi", encoding="XVID")
		tracker.start_tracking()		
		
		# <--- Below uses tracker.py --->
		#tracker = Tracker(output_path=f"{file_path}/{globals.video_count}.mp4", encoding="h264")		
		#(tracker.start_tracking())
		
		
		upload_video(f"{file_path}/{globals.video_count}.avi")
		globals.uploaded_video = True
		
		globals.video_count += 1
	except Exception as e:
		print(e)


def start():
	print("\n- RUNNING PROGRAM")	
	
	# whil either session is in progress or video has not been uploaded
	while globals.session_in_progress:
		try:
			print(f"Trying to record video number: {globals.video_count}")
			asyncio.run(record())
		except Exception as e:
			print(f"Exception: {e}")
			raise RuntimeError("Problem with record and upload, aborting")
