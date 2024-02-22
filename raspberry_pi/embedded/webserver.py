from flask import Flask

app = Flask(__name__, instance_relative_config=True)

@app.route("/session/request_start/<user_id>", methods=["GET"])
def request_session_start(user_id: str):
    print("console testing")
    return f"<p>Request from user_id: {user_id}</p>"

@app.route("/stats/putt_percentage/<user_id>/<session_id>")
def send_putt_percentage(user_id: str, session_id: str):
    return None
