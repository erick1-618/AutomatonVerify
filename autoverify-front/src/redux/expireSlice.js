import { createSlice } from "@reduxjs/toolkit";

const expireSlice = createSlice({
    name: 'sessionExpired',
    initialState: {
        expired: false
    },
    reducers: {
        expire(state, action) {
            state.expired = true;
        },
        reset(state, action) {
            state.expired = false
        }
    }
})

export const {expire, reset} = expireSlice.actions;
export default expireSlice.reducer;