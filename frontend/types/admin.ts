// ─── Admin Stats ─────────────────────────────────────────────────────────────
export interface OrderByStatus {
    _id: string;
    count: number;
}

export interface MonthlyDataPoint {
    _id: string;
    revenue?: number;
    count?: number;
}

export interface TopProduct {
    _id: string;
    name: string;
    quantity: number;
    revenue: number;
}

export interface AdminStats {
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: OrderByStatus[];
    totalUsers: number;
    totalProducts: number;
    recentOrders: AdminOrder[];
    monthlyRevenue: MonthlyDataPoint[];
    monthlyOrders: MonthlyDataPoint[];
    topProducts: TopProduct[];
}

// ─── Admin Order (مع user populate) ──────────────────────────────────────────
export interface AdminOrderUser {
    _id: string;
    name: string;
    email: string;
}

export interface AdminOrderItem {
    product: {
        _id: string;
        name: string;
        coverImage: string;
    };
    price: number;
    quantity: number;
    color?: string;
}

export interface AdminOrder {
    _id: string;
    user: AdminOrderUser;
    cartItems: AdminOrderItem[];
    orderPrice: number;
    taxValue: number;
    shippingValue: number;
    totalOrderPrice: number;
    paymentMethod: 'cash' | 'card';
    status: 'pending' | 'processing' | 'delivered' | 'cancelled' | 'returned';
    isPaid: boolean;
    isDelivered: boolean;
    paidAt?: string;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminOrdersResponse {
    status: string;
    count: number;
    totalCount: number;
    data: { docs: AdminOrder[] };
}

// ─── Admin User ───────────────────────────────────────────────────────────────
export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
    role: 'admin' | 'user';
    isActive: boolean;
    createdAt: string;
}

export interface AdminUsersResponse {
    status: string;
    count: number;
    totalCount: number;
    data: { docs: AdminUser[] };
}

// ─── Admin Coupon ─────────────────────────────────────────────────────────────
export interface AdminCoupon {
    _id: string;
    name: string;
    expire: string;
    discount: number;
    createdAt: string;
}

export interface AdminCouponsResponse {
    status: string;
    count: number;
    data: { docs: AdminCoupon[] };
}
