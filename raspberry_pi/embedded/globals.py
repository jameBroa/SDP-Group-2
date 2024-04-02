# CONSTANTS
FRAME_ID: str = "FRAME-1"

# SESSION VARS
users: [str] = []

session_in_progress: bool = False
session_id: str = ""
session_type: str = ""

# Index for users, 
# 	- Stays at 0 for solo sessions
#  	- Is moded every time it's used for group sessions
whose_turn: int = 0

# Video
video_count: int = 1
uploaded_video: bool = False

# Mostly relevant to group sessions
game_started: bool = False

# Toggled to True if user releases a ball from the app
release_ball: bool = False



def reset():
	global users, session_in_progress, session_id, video_count
	global uploaded_video, session_type, game_started, release_ball, whose_turn
	
	users = []
	video_count = 1
	session_in_progress = False
	session_id = ""
	session_type = ""
	uploaded_video = False
	game_started = False
	release_ball = False
	whose_turn = 0
	
	print("- RESET GLOBAL VARIABLES")
