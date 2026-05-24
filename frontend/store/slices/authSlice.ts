import { createSlice } from "@reduxjs/toolkit"

type User = {
    _id: string
    name: string
    email: string
    role: string
}

type AuthState = {
    token: string | null
    user: User | null
}

const initialState: AuthState = {
    token: null,
    user: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: { payload: { token: string; user: User } }) => {
            state.token = action.payload.token
            state.user = action.payload.user
        },
        clearCredentials: (state) => {
            state.token = null
            state.user = null
        },
    },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer