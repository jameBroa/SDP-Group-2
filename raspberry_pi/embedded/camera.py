import os
import subprocess
from datetime import datetime
from picamera import PiCamera
from time import sleep
from db import upload_video
import globals

cam = PiCamera()

def record_local_video():
    print("Running record local video")
    try:
        new_video_path = generate_new_video_path()
        full_video_path = f'/home/pi/Desktop/videos/{new_video_path}'
        
        if not os.path.exists(full_video_path):
            os.makedirs(f"/home/pi/Desktop/videos/{new_video_path}")

        cam.start_recording(f"{full_video_path}/{globals.video_count}.h264", resize=(1920, 1080))
        print("Recording video...")
        sleep(10)
        cam.stop_recording()
        print("Saved video locally...")

        # convert h264 video to mp4
        print("Converting video to mp4 format...")
        subprocess.run(["ffmpeg","-r","30","-i",f"{full_video_path}.mp4", f"{full_video_path}.h264"])
        
        return upload_video(full_video_path)
    except Exception as error:
        print("Video recording failed", error)
        return RuntimeError("Video recording failed")

def generate_new_video_path():
    print("Generating video path")
    new_video_path = f"{globals.current_user}/{globals.session_id}"
    globals.video_count += 1
    return new_video_path
