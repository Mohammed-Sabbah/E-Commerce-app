import { cookies } from 'next/headers';

const API = process.env.API_URL;

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

        const res = await fetch(`${API}/api/v1/users/myProfile`, {
            headers: { Cookie: cookieHeader },
            cache: 'no-store',
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.data?.doc ?? null;
    } catch {
        return null;
    }
};