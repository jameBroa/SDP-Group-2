from flask import Flask, Response
import globals


app = Flask(__name__, instance_relative_config=True)

@app.route("/session/request_start/<user_id>", methods=["GET"])
def request_session_start(user_id: str):
    print("console testing")
    if not globals.session_in_progress:
        globals.session_in_progress = True
        globals.current_user = user_id
        return Response(status=200, response=f"Session successfully started for user_id: {user_id}.")
    else:
        return Response(status=400, response=f"Request denied, session already in progress.")

@app.route("/session/request_end/<user_id>", methods=["GET"])
def request_session_end(user_id: str):
    if globals.session_in_progress and globals.current_user == user_id:
        globals.session_in_progress = False
        globals.current_user = ""
        return Response(status=200, response=f"Session successfully ended for user_id: {user_id}.")
    else:
        return Response(status=400, response="Request denied, no session in progress or user_id invalid")


@app.route("/stats/putt_percentage/<user_id>/<session_id>")
def send_putt_percentage(user_id: str, session_id: str):
    return None

@app.route("/test")
def test_func():
    print("RECEIVED")
    return Response(status=404, response="Test received")