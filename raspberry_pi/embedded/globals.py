device_id: str = "8neX1a3bJMRsd1Z804WE"

current_user: str = ""
video_count: int = 0
session_in_progress: bool = False
session_id: str = ""

def reset():
	global current_user, session_in_progress, session_id, video_count
	video_count = 0
	session_id = ""
	current_user = ""
	session_in_progress = False
	
	print("Reset global variables")
