from db import upload_video
import camera
import globals
import cv2 as cv

def start():
	print(cv.__version__)
	print("Running")
	while globals.session_in_progress:
		print("Session in progress")
		try:
			print("Trying to record video")
			camera.record_local_video()
		except:
			raise RuntimeError("Problem with record and upload, aborting")
			
	print("Session not in progress")
