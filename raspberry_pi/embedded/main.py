from webserver import app, socketio

if __name__ == "__main__":
    socketio.run(app, host="172.24.37.110", port=5000, debug=True)
