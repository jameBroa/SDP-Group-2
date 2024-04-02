import { getDoc, doc } from "firebase/firestore";
import { addFriend, addSession, addVideo, addVideoSession } from "../slices/userSlice";
import db from "../../config/database";
import { useDispatch, useSelector } from 'react-redux';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

export function useReduxStateUpdater() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user); 

    const fetchFriends = () => {
        // gets friends from database
        // adds ones that aren't in state
        getDoc(doc(db, "users", user.uid))
        .then((d) => {
            const listOfUIDs = d.data().friends;
            listOfUIDs.forEach(friendUID => {
                // Here you should dispatch the addFriend action
                if (!user.friends.includes(friendUID)) {
                    dispatch(addFriend(friendData));
                }
            })
        });
    }

    const fetchSessions = () => {
        getDoc(doc(db, "users", user.uid))
        .then((d) => {
            const listOfSessionIDs = d.data().sessions;

            listOfSessionIDs.forEach(sessionID => {
                // Here you should dispatch the addSession action
                if (!user.sessions.includes(sessionID)) {
                    console.log("Adding session " + sessionID + " to state");
                    dispatch(addSession(sessionID));
                };
            });
        });
    }

    const fetchVideosPerSession = async ({ session }) => {
        if (new Map(user.videos).has(session) == false) {
            dispatch(addVideoSession({ session: session }))
        }

        try {
            const storage = getStorage();
            const sessionRef = ref(storage, `videos/${user.uid}/${session}`);
            const items = await listAll(sessionRef); // List all items (videos) in the session directory
            
            await Promise.all(items.items.map(async (item) => {
                const url = await getDownloadURL(item); // Get download URL for each video

                let videosMap = new Map(user.videos);
                let videos = videosMap.get(session);

                if (videos.includes(url) == false) {
                    dispatch(addVideo({
                        session: session,
                        video: url
                    }));
                };
            }));
          } catch (error) {
            console.error('Error fetching videos:', error);
          }
    }

    const fetchVideos = async () => {
        // fetches videos from database
        // adds ones that aren't in state
        try {      
            await Promise.all(user.sessions.map(async (session) => {
                fetchVideosPerSession({ session: session });
            }));
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    }

    return { fetchFriends, fetchSessions, fetchVideos, fetchVideosPerSession };
}
