from firebase_admin import credentials, firestore, storage, initialize_app
from datetime import datetime
import globals

cred = credentials.Certificate('conf.json')
initialize_app(cred, {'storageBucket':'intelliputt-2024.appspot.com'})

def upload_video(video_path: str):
    bucket = storage.bucket()

    # Path in Fb
    destination_blob = f'videos/{globals.users[globals.whose_turn]}/{globals.session_id}/{globals.video_count}.avi'

    try:
        blob = bucket.blob(destination_blob)
        blob.upload_from_filename(video_path)
        print(f'- FILE {video_path} UPLOADED TO {destination_blob}')
    except:
        print(f"Failed to upload video {video_path} to firestore")
    
def ended_session():
    db = firestore.client()
    
    # Edit session to say it ended now
    users_ref = db.collection('sessions').document(globals.session_id)
    users_ref.update({
        "uid": globals.users,
        "sessionEnded": firestore.SERVER_TIMESTAMP
    })
    
    print(f"- UPDATED END OF SESSION FOR {globals.users}")

def join_session(uid):
    db = firestore.client()
    
    # Add session id to user's sessions
    user_ref = db.collection('users').document(uid)
    user_ref.update({
        "sessions": firestore.ArrayUnion([globals.session_id])
    })
    
    print(f"User {uid} joined {globals.session_id}")

def start_session(uid):
    db = firestore.client()
    sessions_ref = db.collection('sessions').add({
        "uid": uid,
        "sessionStarted": firestore.SERVER_TIMESTAMP,
        "sessionEnded": "",
        "device": globals.device_id
    })
    
    # Get session id from doc added
    session_id = sessions_ref[1].id
    
    # Add session id to user's sessions
    user_ref = db.collection('users').document(uid)
    user_ref.update({
        "sessions": firestore.ArrayUnion([session_id])
    })
    
    print(f"- STARTED SESSION {session_id} FOR {uid}")
    return session_id
