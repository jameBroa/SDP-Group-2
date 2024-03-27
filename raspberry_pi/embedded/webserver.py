from flask import Flask
import globals
import db
import execute
import threading
import masterControlProgram
from flask_socketio import SocketIO, emit
from flask_cors import CORS


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on('start_solo_session')
def request_solo_session_start(user_id: str):
    if not globals.session_in_progress:
        print("\n -- STARTED SOLO SESSION")
        globals.session_in_progress = True
        globals.current_user.append(user_id)
        globals.session_type = "solo"

        db.start_session()
        emit('solo_session_started', {'user_id': user_id, 'session_id': globals.session_id})
        
        def do_in_parallel():
            execute.start()

        thread = threading.Thread(target=do_in_parallel)
        thread.start()
    else:
        emit('session_denied', {'message': 'Session already in progress'})


@socketio.on('release_ball')
def request_release_ball():
    lift = masterControlProgram.Lift(solenoid_speed=190,dc_motor_speed=30)
    lift.release_ball()
        

@socketio.on('start_group_session')
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

    if globals.session_in_progress and globals.session_type == "group" and globals.session_id[0:6] == session_id:
        print("\n -- JOINED GROUP SESSION")
        globals.current_user.append(user_id)

        db.join_session(user_id)

        emit('group_session_joined', {'user_id': user_id, 'session_id': globals.session_id})
        emit('num_players_updated', {'numPlayers': len(globals.current_user)}, broadcast=True)
    else:
        emit('group_session_denied', {'message': 'Request denied, session has either ended or is not group'})


@socketio.on('start_group_game')
def request_group_session_start_game(user_id: str):
    if globals.session_in_progress and user_id in globals.current_user:
        globals.game_started = True

        def do_in_parallel():
            execute.start()

        thread = threading.Thread(target=do_in_parallel)
        thread.start()

        emit('group_game_started', {'user_id': user_id, 'session_id': globals.session_id}, broadcast=True)
        emit("group_game_whose_turn", {'user_id': user_id}, broadcast=True)
    else:
        emit('group_game_start_denied', {'message': 'Request denied, session has either ended or is not group'},
             broadcast=True)


@socketio.on('end_session')
def request_session_end(user_id: str):
    if globals.session_in_progress and user_id in globals.current_user:
        print("\n -- ENDED SESSION")
        db.ended_session()

        emit('session_ended', {'user_id': user_id}, broadcast=True)
        
        globals.reset()
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
    print("Trying to connect to frame")
    if globals.device_id == frame_id:
        emit('frame_connected', {'status': 'success', 'message': 'Server alive'})
    else:
        emit('frame_not_found', {'status': 'failure', 'message': 'Frame ID not found'})


@socketio.on('test_event')
def test_func():
    print("RECEIVED")
    emit('test_response', {'status': 'success', 'message': 'Received'})
