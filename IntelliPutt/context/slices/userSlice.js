import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null
};
  
export const userSlice = createSlice({ 
    name: 'user',
    initialState,
    reducers: {
        login(state, action) {
            state.user = {
                uid: action.payload["uid"],
                email: action.payload["email"],
                name: action.payload["name"],
                experience: action.payload["experience"],
                friends: action.payload["friends"],
                sessions: action.payload["sessions"],
                streak: action.payload["streak"],
                data: action.payload["data"],
                video: action.payload["video"],
                videos: [],
                videosTimestamp: "",
            };
        },
        logout(state) {
            state.user = null;
        },
        setFriends(state, action) {
            state.user.friends = action.payload;
        },
        addFriend(state, action) {
            state.user.friends.push(action.payload);
        },
        addSession(state, action) {
            console.log("Adding " + action.payload + " to " + state.user.sessions);
            state.user.sessions.push(action.payload);
        },
        setVideos(state, action) {
            // Convert the Map to an array of key-value pairs
            const videosArray = Array.from(action.payload);
        
            // Update the Redux state with the serialized array and timestamp
            state.user.videos = videosArray;
            state.user.videosTimestamp = Date.now();
        },
        
        addVideoSession(state, action) {
            // Create a new Map from the existing videos array
            const mapVideos = new Map(state.user.videos);
        
            // Add a new session entry with an empty array of videos
            mapVideos.set(action.payload.session, []);
        
            // Convert the Map back to an array of key-value pairs
            state.user.videos = Array.from(mapVideos);
        }, 
        
        addVideo(state, action) {
            // Create a new Map from the existing videos array
            const mapVideos = new Map(state.user.videos);
        
            // Push the new video to the session's array of videos
            mapVideos.get(action.payload.session).push(action.payload.video);
        
            // Convert the Map back to an array of key-value pairs
            state.user.videos = Array.from(mapVideos);
        }        
    },
});

export const { login, logout, addFriend, setFriends, addSession, addVideo, setVideos, addVideoSession } = userSlice.actions;

export default userSlice.reducer;