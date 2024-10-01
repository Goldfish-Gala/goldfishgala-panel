import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    user: any;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
        setProfile: (state, action: PayloadAction<{ user: any }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
    },
});

export const { login, logout, setProfile } = authSlice.actions;

export default authSlice.reducer;
