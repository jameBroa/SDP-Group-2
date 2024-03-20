import { useEffect } from 'react';
import { getDoc, doc } from "firebase/firestore";
import { addFriend, addSession } from "../slices/userSlice";
import db from "../../config/database";
import { useDispatch, useSelector } from 'react-redux';

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
                    dispatch(addSession(sessionID));
                };
            });
        });
    }

    return { fetchFriends, fetchSessions };
}
