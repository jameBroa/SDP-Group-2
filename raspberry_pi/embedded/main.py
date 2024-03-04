from webserver import app
from db import upload_video
from camera import record_local_video

from globals import session_in_progress, current_user

def run():
    while True:
        if session_in_progress and current_user != "":
            # Add "if" for sensor input
            while session_in_progress:
                try:
                    video_path = record_local_video(current_user)
                    upload_video(video_path)
                except:
                    raise RuntimeError("Problem with record and upload, aborting")
            break
        # else:
        #     # print("Idle, waiting for session to start")

if __name__ == "__main__":
    app.run() # init webserver
    run()