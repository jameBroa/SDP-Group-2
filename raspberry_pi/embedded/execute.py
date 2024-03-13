from db import upload_video
import camera
import globals
import cv2 as cv
import subprocess
import time
import threading
import asyncio
from tracker import Tracker
 


async def record():
	try:
		tracker = Tracker(output_path=f'/Users/james/Desktop/{globals.video_count}.mp4', encoding="mp4v")
		# asyncio.get_event_loop().run_until_complete(tracker.start_tracking())
		(tracker.start_tracking())
		globals.video_count += 1
	except Exception as e:
		print(e)


def start():
	print(cv.__version__)
	print("Running")	
	while globals.session_in_progress:
		print("Session in progress")
		try:
			print(f"Trying to record video number: {globals.video_count}")
			asyncio.run(record())
			# asyncio.run(camera.record_local_video())
			# video_thread = threading.Thread(target=camera.record_local_video())
			# video_thread.start()
			# video_thread.join()			

		except Exception as e:
			print(f"Exception: {e}")
			raise RuntimeError("Problem with record and upload, aborting")
			
	print("Session not in progress")
