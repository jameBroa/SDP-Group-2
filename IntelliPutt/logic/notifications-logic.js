
import { collection, query, where } from "firebase/firestore";
import db from "../config/database";

// input: [String] where String are ids of friend requests

const friendRequestCollection = collection(db, "friendRequests")

export function filterUnseenNotifs(data) {

}

export function filterSeenNotifs(data) {
    let res = []
    data.map((req) => {
        if(req.status == "accepted"){
            res.push(req.from );
        }
    })

    return res;
}

    
