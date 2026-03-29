import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "@/services/authService";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
}

interface RegisterResponse {
    token: string;
    user: User;
}

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ApiError {
    response?: { data?: { message: string } };
    message?: string;
}

export const useRegister = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation<RegisterResponse, ApiError, RegisterRequest>({
        mutationFn: register,

        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data.user);
            router.push("/");
            router.refresh();
        },

        onError: (error) => {
            console.log("Register error", error.response?.data?.message || error.message);
        },
    });
};