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
                friends: action.payload["friends"]
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
        }
    },
});

export const { login, logout, addFriend, setFriends } = userSlice.actions;

export default userSlice.reducer;