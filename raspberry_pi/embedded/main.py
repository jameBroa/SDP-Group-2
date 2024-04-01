from webserver import app, socketio

if __name__ == "__main__":
    socketio.run(app, host="172.24.40.199", port=5000, debug=True)
