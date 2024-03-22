from firebase_admin import credentials, firestore, storage, initialize_app
from datetime import datetime
import globals

cred = credentials.Certificate('conf.json')
initialize_app(cred, {'storageBucket':'intelliputt-2024.appspot.com'})

def upload_video(video_path: str):
    ### Test -- interacting with storage bucket for images/video
    bucket = storage.bucket()

    # Example: Upload test file to bucket
    destination_blob = f'videos/{globals.current_user}/{globals.session_id}/{globals.video_count}.avi'

    try:
        blob = bucket.blob(destination_blob)
        blob.upload_from_filename(video_path)
        print(f'- FILE {video_path} UPLOADED TO {destination_blob}')
    except:
        print(f"Failed to upload video {video_path} to firestore")
    
def ended_session():
    db = firestore.client()
    users_ref = db.collection('sessions').document(globals.session_id)
    users_ref.update({
        "sessionEnded": firestore.SERVER_TIMESTAMP
    })
    
    print(f"- UPLOADED SESSION FOR {globals.current_user}")


def start_session():
    db = firestore.client()
    sessions_ref = db.collection('sessions').add({
        "uid": globals.current_user,
        "sessionStarted": firestore.SERVER_TIMESTAMP,
        "sessionEnded": "",
        "device": globals.device_id
    })
    
    
    globals.session_id = sessions_ref[1].id
    user_ref = db.collection('users').document(globals.current_user)
    user_ref.update({
        "sessions": firestore.ArrayUnion([globals.session_id])
    })
    
    print(f"- STARTED SESSION {globals.session_id} FOR {globals.current_user[0]}")
