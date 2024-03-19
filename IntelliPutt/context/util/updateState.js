import { getDoc, doc } from "firebase/firestore";
import { addFriend, addSession } from "../slices/userSlice";
import db from "../../config/database";
import { useDispatch } from 'react-redux';

class ReduxStateUpdater {
    static async fetchFriends(user) {
        // gets friends from database
        // adds ones that aren't in state
        getDoc(doc(db, "users", user.uid))
        .then((d) => {
            const listOfUIDs = d.data().friends;
            listOfUIDs.forEach(friendUID => {
                if (!user.friends.includes(friendUID)) {
                    dispatch(addFriend(friendData));
                }
            })
        });
    }

    static async fetchSessions(user) {
        const dispatch = useDispatch();

        getDoc(doc(db, "users", user.uid))
        .then((d) => {
            const listOfSessionIDs = d.data().sessions;
            listOfSessionIDs.forEach(sessionID => {
                if (!user.sessions.includes(sessionID)) {
                    dispatch(addSession(sessionID));
                };
            });
        });
    };
}

export default ReduxStateUpdater;