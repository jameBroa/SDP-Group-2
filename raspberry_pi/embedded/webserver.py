from flask import Flask, Response
from firebase_admin import firestore
import globals
import db
import execute
import threading
import asyncio

app = Flask(__name__, instance_relative_config=True)

@app.route("/session/request_start/<user_id>", methods=["GET"])
def request_session_start(user_id: str):
    print("console testing")
    if not globals.session_in_progress:
        globals.session_in_progress = True
        globals.current_user = user_id
        
        def do_in_parallel():
            db.start_session()
            asyncio.run(execute.start())
        
        thread = threading.Thread(target=do_in_parallel)
        thread.start()
        
        return Response(status=200, response=f"Session successfully started for user_id: {user_id}")
    else:
        return Response(status=400, response="Request denied, session current in progress")

@app.route("/session/request_end/<user_id>", methods=["GET"])
def request_session_end(user_id: str):
    if globals.session_in_progress and globals.current_user == user_id:
        db.ended_session()
        
        globals.reset()
        return Response(status=200, response=f"Session successfully ended for user_id: {user_id}")
    else:
        return Response(status=400, response="Request denied, no session in progress or user_id invalid")

@app.route("/stats/putt_percentage/<user_id>/<session_id>")
def send_putt_percentage(user_id: str, session_id: str):
    return None

@app.route("/test")
def test_func():
    print("RECEIVED")
    return Response(response="received", status=200)
