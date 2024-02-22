from firebase_admin import credentials, firestore, storage, initialize_app

def main():
    cred = credentials.Certificate('/Users/lucas/Downloads/intelliputt_credentials.json')
    initialize_app(cred, {'storageBucket':'intelliputt-2024.appspot.com'})

    ### Test -- connect to DB and get elements from 'devices' collection
    db = firestore.client()

    users_ref = db.collection('devices')
    docs = users_ref.stream()

    for doc in docs:
        print(f'Document ID: {doc.id}, Data: {doc.to_dict()}')

    ### Test -- interacting with storage bucket for images/video
    bucket = storage.bucket()

    # Example: Upload test file to bucket
    local_file_path = '/Users/lucas/Downloads/couple.jpg'
    destination_blob_name = 'images/golf_couple_test.jpg'

    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(local_file_path)

    print(f'File {local_file_path} uploaded to {destination_blob_name}')

    # Example: Download file from bucket
    downloaded_file_path = '/Users/lucas/Downloads/newtest.jpg'
    blob.download_to_filename(downloaded_file_path)

    print(f'File downloaded to {downloaded_file_path}')

if __name__ == "__main__":
    main()