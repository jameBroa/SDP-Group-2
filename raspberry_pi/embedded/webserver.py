from flask import Flask
import globals
import db
import execute
import threading
from flask_socketio import SocketIO, emit

app = Flask(__name__, instance_relative_config=True)
socketio = SocketIO(app)


@socketio.on('start_solo_session')
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

        emit('session_started', {'user_id': user_id})
    else:
        emit('session_denied', {'message': 'Session already in progress'})


@socketio.on('request_group_session_start')
def request_group_session_start(user_id: str):
    if not globals.session_in_progress:
        print("\n -- STARTED GROUP SESSION")
        globals.session_in_progress = True
        globals.current_user.append(user_id)
        globals.session_type = "group"

        db.start_session()

        emit('group_session_started', {'session_id': globals.session_id, 'user_id': user_id})
    else:
        emit('session_denied', {'message': 'Request denied, session current in progress'})


@socketio.on('join_group_session')
def request_group_session_join(data):
    user_id = data['user_id']
    session_id = data['session_id']

    if user_id in globals.current_user:
        print("User already in session")
    elif globals.session_in_progress and globals.session_type == "group" and globals.session_id[0:6] == session_id:
        print("\n -- JOINED GROUP SESSION")
        globals.current_user.append(user_id)

        db.join_session(user_id)

        emit('session_joined', {'user_id': user_id, 'session_id': globals.session_id}, broadcast=True)
    else:
        emit('session_denied', {'message': 'Request denied, session has either ended or is not group'})


@socketio.on('start_group_game')
def request_group_session_start_game(user_id: str):
    if globals.session_in_progress and user_id in globals.current_user:
        globals.game_started = True

        def do_in_parallel():
            execute.start()

        thread = threading.Thread(target=do_in_parallel)
        thread.start()

        emit('game_started', {'session_id': globals.session_id}, broadcast=True)
    else:
        emit('game_start_denied', {'message': 'Request denied, session has either ended or is not group'},
             broadcast=True)


@socketio.on('end_session')
def request_session_end(user_id: str):
    if globals.session_in_progress and user_id in globals.current_user:
        print("\n -- ENDED SESSION")
        db.ended_session()
        globals.reset()

        emit('session_ended', {'user_id': user_id}, broadcast=True)
    else:
        emit('session_end_denied', {'message': 'Request denied, no session in progress or uid invalid'},
             broadcast=True)


@socketio.on('request_putt_percentage')
def send_putt_percentage(data):
    user_id = data['user_id']
    session_id = data['session_id']
    # Logic to calculate putt percentage
    putt_percentage = 75  # Example value, replace with actual calculation
    emit('putt_percentage', {'user_id': user_id, 'session_id': session_id, 'putt_percentage': putt_percentage})


@socketio.on('connect_to_frame')
def request_connect_to_frame(frame_id: str):
    if globals.device_id == frame_id:
        emit('connection_response', {'status': 'success', 'message': 'Server alive'})
    else:
        emit('connection_response', {'status': 'failure', 'message': 'Frame ID not found'})


@socketio.on('test_event')
def test_func():
    print("RECEIVED")
    emit('test_response', {'status': 'success', 'message': 'Received'})
