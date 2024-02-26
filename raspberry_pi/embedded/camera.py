import os
from datetime import datetime
from picamera import PiCamera
from time import sleep

camera = PiCamera()

def record_local_video(user_id: str, time_seconds: int):
    try:
        new_video_path = generate_new_video_title(user_id)
        camera.start_recording(f'/home/pi/Desktop/videos/{new_video_path}')
        sleep(time_seconds)
        camera.stop_recording()
        return new_video_path
    except:
        return RuntimeError("Video recording failed")

def generate_new_video_title(user_id: str):
    user_videos_path = f"/home/pi/Desktop/videos/{user_id}"
    try:
        date_dirs = [d for d in os.listdir(user_videos_path) if os.path.isdir(os.path.join(user_videos_path, d))]
        curr_date = datetime.now().strftime("%d_%m_%Y")

        if curr_date not in date_dirs:
            curr_date_dir = os.path.join(user_videos_path, curr_date)
            os.makedirs(curr_date_dir)
            next_file_number = 1
        else:
            curr_date_dir = os.path.join(user_videos_path, curr_date)
            files_in_curr_date = os.listdir(curr_date_dir)

            if files_in_curr_date:
                sorted_files = sorted(files_in_curr_date, key=lambda x: int(x.split('_')[0]))
                next_file_number = int(sorted_files[-1].split('_')[0]) + 1
            else:
                next_file_number = 1

        # This is the path from the top-level "videos" directory, not the absolute path.
        new_video_path = f"user_id/curr_date/{next_file_number}_{curr_date}.h264"
        return new_video_path


    except FileNotFoundError:
        print(f"Directory '{user_videos_path}' not found.")
    except PermissionError:
        print(f"Permission error accessing directory '{user_videos_path}'.")
    except Exception as e:
        print(f"An error occurred: {e}")
