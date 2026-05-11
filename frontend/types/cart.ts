export interface CartProduct {
    _id: string;
    name: string;
    priceAfterDiscount?: number;
    coverImage: string;
    images?: string[];
}

export interface CartItem {
    _id: string;
    product: CartProduct;
    price: number;
    quantity: number;
    color?: string;
}

export interface Cart {
    cartItems: CartItem[];
}

export interface CartResponse {
    data?: {
        cart?: Cart;
    };
}
