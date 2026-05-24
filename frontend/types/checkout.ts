import type { Address } from '@/services/server/userService';
export type { Address };

export interface OrderItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color?: string;
}

export interface BillingData {
    firstName: string;
    companyName: string;
    street: string;
    apartment: string;
    city: string;
    phone: string;
    email: string;
    saveInfo: boolean;
}

export type PaymentMethod = 'cash' | 'card';