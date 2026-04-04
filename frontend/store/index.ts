import { configureStore } from "@reduxjs/toolkit"
import wishlistReducer from "./slices/wishlistSlice"
import authReducer from "./slices/authSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        wishlist: wishlistReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch