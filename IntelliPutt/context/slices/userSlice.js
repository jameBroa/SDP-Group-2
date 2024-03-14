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
                video: action.payload["video"]
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
            state.user.sessions.push(action.payload);
        }
    },
});

export const { login, logout, addFriend, setFriends } = userSlice.actions;

export default userSlice.reducer;