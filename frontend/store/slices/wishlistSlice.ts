import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Product } from "@/types/api"

type WishlistState = {
    items: Product[]
    loading: boolean
    error: string | null
}

const initialState: WishlistState = {
    items: [],
    loading: false,
    error: null,
}

// جيب الـ wishlist من الـ API
export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
    const res = await fetch("/api/wishlist")
    const data = await res.json()
    return data.data as Product[]
})

// أضف منتج
export const addToWishlist = createAsyncThunk("wishlist/add", async (product: Product) => {
    await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId: product._id }),
        headers: { "Content-Type": "application/json" },
    })
    return product
})

// احذف منتج
export const removeFromWishlist = createAsyncThunk("wishlist/remove", async (productId: string) => {
    await fetch(`/api/wishlist/${productId}`, { method: "DELETE" })
    return productId
})

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => { state.loading = true })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message ?? "Something went wrong"
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items.push(action.payload)
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p._id !== action.payload)
            })
    },
})

export default wishlistSlice.reducer