import { getDoc, doc } from "firebase/firestore";
import { useSelector } from 'react-redux';
import { addFriend } from "../slices/userSlice";
import db from "../../config/database";

class ReduxStateUpdater {
    static async fetchFriends() {
        const user = useSelector((state) => state.user.user);

        // gets friends from database
        // adds ones that aren't in state
        getDoc(doc(db, "users", user["uid"]))
        .then((d) => {
            const listOfUIDs = d.data()["friends"];
            listOfUIDs.forEach(friendUID => {
                if (!user["friends"].includes(friendUID)) {
                    addFriend(friendData);
                }
            })
        });
    }
}

export default ReduxStateUpdater;