import { apiClient } from '@/lib/apiClient';

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
    addresses: Address[];
}

export interface Address {
    street?: string;
    apartment?: string;
    city?: string;
}

export const getMyProfile = async (): Promise<UserProfile | null> => {
    try {
        const res = await apiClient.get('/api/v1/users/myProfile');
        return res.data?.data?.doc ?? null;
    } catch {
        return null;
    }
};