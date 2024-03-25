from flask import Flask, Response
from firebase_admin import firestore
import globals
import db
import execute
import threading
import asyncio

app = Flask(__name__, instance_relative_config=True)

@app.route("/session/solo/request_start/<user_id>", methods=["GET"])
def request_solo_session_start(user_id: str):
    if not globals.session_in_progress:
        print("\n -- STARTED SOLO SESSION")
        globals.session_in_progress = True
        globals.current_user.append(user_id)
        globals.session_type = "solo"
        
        def do_in_parallel():
            db.start_session()
            execute.start()
        
        thread = threading.Thread(target=do_in_parallel)
        thread.start()
        # execute.start()
        # asyncio.run(execute.start())
        
        return Response(status=200, response=f"Solo session successfully started for user_id: {user_id}")
    else:
        return Response(status=400, response="Request denied, session current in progress")
        
@app.route("/session/group/request_start/<user_id>", methods=["GET"])
def request_group_session_start(user_id: str):
    if not globals.session_in_progress:
        print("\n -- STARTED GROUP SESSION")
        globals.session_in_progress = True
        globals.current_user.append(user_id)
        globals.session_type = "group"
        
        db.start_session()
        
        return Response(status=200, response=f"Group session {globals.session_id} successfully started by user {globals.current_user}")
    else:
        return Response(status=400, response="Request denied, session current in progress")
        
        
@app.route("/session/group/join/<session_id>/<user_id>", methods=["GET"])
def request_group_session_join(session_id: str, user_id: str):
    if user_id in globals.current_user:
        print("User already in session")
    elif globals.session_in_progress and globals.session_type == "group" and globals.session_id[0:6] == session_id:
        print("\n -- JOINED GROUP SESSION")
        globals.current_user.append(user_id)
        
        db.join_session(user_id)
        
        return Response(status=200, response=f"{user_id} successfully joined {globals.session_id}")
    else:
        return Response(status=400, response="Request denied, session has either ended or is not group")
        

@app.route("/session/group/players/<user_id>", methods=["GET"])
def request_group_session_number_of_players(user_id: str):
    if globals.session_in_progress and user_id in globals.current_user:
        return Response(status=200, response=f"{len(globals.current_user)}")
    else:
        return Response(status=400, response="Request denied, session has either ended or is not group")


@app.route("/session/group/start_game/<user_id>", methods=["GET"])
def request_group_session_start_game(user_id: str):
    if globals.session_in_progress and user_id in globals.current_user:
        globals.game_started = True
        def do_in_parallel():
            execute.start()
        
        thread = threading.Thread(target=do_in_parallel)
        thread.start()
        return Response(status=200, response=f"Game started for {globals.session_id}")
    else:
        return Response(status=400, response="Request denied, session has either ended or is not group")
        
@app.route("/session/group/has_game_started/<user_id>", methods=["GET"])
def request_group_session_check_start_game(user_id: str):
    if globals.session_in_progress and user_id in globals.current_user and globals.game_started:
        
        return Response(status=200, response=f"Game started for {globals.session_id}")
    else:
        return Response(status=400, response="Game has not yet started")

@app.route("/session/request_end/<user_id>", methods=["GET"])
def request_session_end(user_id: str):
    if globals.session_in_progress and user_id in globals.current_user:
        print("\n -- ENDED SESSION")
        db.ended_session()
        globals.reset()
        return Response(status=200, response=f"Session successfully ended for user_id: {user_id}")
    else:
        return Response(status=400, response="Request denied, no session in progress or uid invalid")


@app.route("/stats/putt_percentage/<user_id>/<session_id>")
def send_putt_percentage(user_id: str, session_id: str):
    return None
    

@app.route("/connect/<frame_id>")
def request_connect_to_frame(frame_id: str):
    if globals.device_id == frame_id:
        return Response(status=200, response=f"Server alive")
    else:
        return Response(status=400, response=f"Frame ID not found")

@app.route("/test")
def test_func():
    print("RECEIVED")
    return Response(response="received", status=200)
