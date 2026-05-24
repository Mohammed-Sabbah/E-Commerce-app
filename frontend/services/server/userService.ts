import { apiClient } from '@/lib/apiClient';
import { cookies } from 'next/headers';

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
    addresses: Address[];
}

export interface Address {
    _id: string;  
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
}

export const getMyProfile = async (): Promise<UserProfile | null> => {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const res = await apiClient.get('/api/v1/users/myProfile', {
            headers: {
                Cookie: cookieHeader,
            },
        });
        return res.data?.data?.doc ?? null;
    } catch {
        return null;
    }
};