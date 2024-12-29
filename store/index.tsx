import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import authSlice from '@/store/authSlice';
import eventSlice from './eventSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    auth: authSlice,
    event: eventSlice,
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;
export type IRootState = ReturnType<typeof rootReducer>;
