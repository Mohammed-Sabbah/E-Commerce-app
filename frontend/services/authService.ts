import axios from "axios";

export const login = async (data: { email: string; password: string }) => {
    const res = await axios.post(
        '/api/v1/auth/login',
        data,
        { withCredentials: true }
    );
    return res.data;
};

export const logout = async () => {
    const res = await axios.post(
        '/api/v1/auth/logout',
        {},
        { withCredentials: true }
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
        '/api/v1/auth/signup',
        data,
        { withCredentials: true }
    );
    return res.data;
};

export const forgetPassword = async (data: { email: string }) => {
    const res = await axios.post(
        '/api/v1/auth/forgetPassword',
        data,
        { withCredentials: true }
    );
    return res.data;
};

export const verifyResetCode = async (data: { resetCode: string }) => {
    const res = await axios.post(
        '/api/v1/auth/verifyResetCode',
        data,
        { withCredentials: true }
    );
    return res.data;
};

export const resetPassword = async (data: { email: string; newPassword: string; confirmNewPassword: string }) => {
    const res = await axios.patch('/api/v1/auth/resetPassword', data, { withCredentials: true });
    return res.data;
};