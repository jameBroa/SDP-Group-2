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
            };
        },
        logout(state) {
            state.user = null;
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;