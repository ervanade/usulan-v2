import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload
        },
        logoutUser: (state) => {
            state.user = null
            localStorage.removeItem('user')

        }
    }
})

export default authSlice.reducer
export const { loginUser, logoutUser } = authSlice.actions