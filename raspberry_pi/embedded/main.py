from webserver import app, socketio

if __name__ == "__main__":
    socketio.run(app, host="172.24.42.106", port=5000, debug=True)
