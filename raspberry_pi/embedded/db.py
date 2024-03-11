from firebase_admin import credentials, firestore, storage, initialize_app
from datetime import datetime
import globals

cred = credentials.Certificate('conf.json')
initialize_app(cred, {'storageBucket':'intelliputt-2024.appspot.com'})

def upload_video(video_path: str):
    # db = firestore.client()

    # users_ref = db.collection('videos')
    # docs = users_ref.stream()

    # for doc in docs:
    #     print(f'Document ID: {doc.id}, Data: {doc.to_dict()}')

    ### Test -- interacting with storage bucket for images/video
    bucket = storage.bucket()

    # Example: Upload test file to bucket
    destination_blob = f'videos/{video_path}'

    try:
        blob = bucket.blob(destination_blob)
        blob.upload_from_filename(video_path)
        print(f'File {video_path} uploaded to {destination_blob}')
        return True
    except:
        return RuntimeError(f"Failed to upload video {video_path} to firestore")
    
def ended_session():
    db = firestore.client()
    users_ref = db.collection('sessions').document(globals.session_id)
    users_ref.update({
        "sessionEnded": firestore.SERVER_TIMESTAMP
    })
    print(f"Uploaded session for {globals.current_user}")


def start_session():
    db = firestore.client()
    sessions_ref = db.collection('sessions').add({
        "uid": globals.current_user,
        "sessionStarted": firestore.SERVER_TIMESTAMP,
        "sessionEnded": "",
        "device": globals.device_id
    })
    globals.session_id = sessions_ref[1].id
    print(f"Started session {globals.session_id} for {globals.current_user}")
