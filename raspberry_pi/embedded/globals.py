device_id: str = "FRAME-1"

current_user: [str] = []
video_count: int = 0
session_in_progress: bool = False
session_id: str = ""
session_type: str = ""
uploaded_video: bool = False
game_started: bool = False

def reset():
	global current_user, session_in_progress, session_id, video_count, uploaded_video, session_type, game_started
	video_count = 0
	session_id = ""
	current_user = []
	session_type = ""
	game_started = False
	session_in_progress = False
	uploaded_video = False
	
	print("- RESET GLOBAL VARIABLES")
