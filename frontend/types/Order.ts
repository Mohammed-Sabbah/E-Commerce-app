export interface OrderItem {
    product: {
        _id: string;
        name: string;
        coverImage: string;
    };
    price: number;
    quantity: number;
    color: string;
}

export interface Order {
    _id: string;
    cartItems: OrderItem[];
    shippingAddress: string;
    orderPrice: number;
    taxValue: number;
    shippingValue: number;
    totalOrderPrice: number;
    paymentMethod: "cash" | "card";
    status: "pending" | "processing" | "delivered" | "cancelled" | "returned";
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
}

export type OrderFilter = "all" | "active" | "cancelled" | "returned";