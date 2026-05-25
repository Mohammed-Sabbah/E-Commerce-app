import axios from "axios";

export const login = async (data: { email: string; password: string }) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        data,
        { withCredentials: true } // ✅ عشان السيرفر يقرأ الكوكي
    );
    return res.data;
};

export const logout = async () => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true } // ✅ عشان السيرفر يحذف الكوكي
    );
    return res.data;
};

export const register = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`,
        data,
        { withCredentials: true }
    );
    return res.data;
};