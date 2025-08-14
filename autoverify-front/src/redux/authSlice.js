import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    token: null,
    name: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      // payload: { token, name }
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      state.name = action.payload.name;
      localStorage.setItem('name', action.payload.name);
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
      state.name = null;
      localStorage.removeItem('name');
    },
  },
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;