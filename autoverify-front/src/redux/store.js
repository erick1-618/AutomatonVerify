import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import expireReducer from "./expireSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        expired: expireReducer
    },
});