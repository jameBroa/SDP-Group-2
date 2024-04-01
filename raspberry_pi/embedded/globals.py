device_id: str = "FRAME-1"

current_user: [str] = []
video_count: int = 0
session_in_progress: bool = False
session_id: str = ""
session_type: str = ""
uploaded_video: bool = False
game_started: bool = False
release_ball: bool = False
whose_turn: str = ""

def reset():
	global current_user, session_in_progress, session_id, video_count
	global uploaded_video, session_type, game_started, release_ball, whose_turn
	
	current_user = []
	video_count = 0
	session_in_progress = False
	session_id = ""
	session_type = ""
	uploaded_video = False
	game_started = False
	release_ball = False
	whose_turn = ""
	
	print("- RESET GLOBAL VARIABLES")
