import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { login } from "@/services/authService";
import { useRouter } from "@/i18n/navigation";

interface User {
    id: string;
    name: string;
    email: string;
}

interface LoginResponse {
    token: string;
    user: User;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface ApiError {
    response?: { data?: { message: string } };
    message?: string;
}

export const useLogin = () => {
    const t = useTranslations("toasts");
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation<LoginResponse, ApiError, LoginRequest>({
        mutationFn: login,

        onSuccess: (data) => {
            toast.success(t("loginSuccess"));
            queryClient.setQueryData(["user"], data.user);
            router.push("/");
            router.refresh();
        },

        onError: () => {
            toast.error(t("loginFailed"));
        },
    });
};
















// import { useMutation } from "@tanstack/react-query";
// import { login } from "@/services/authService";

// export const useLogin = () => {
//     return useMutation({
//         mutationFn: login,

//         onSuccess: (data) => {
//             console.log("Login success", data);

//             // مثال: تخزين التوكن
//             localStorage.setItem("token", data.token);
//         },

//         onError: (error: any) => {
//             console.log("Login error", error.response?.data || error.message);
//         },
//     });
// };