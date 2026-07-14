import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { register } from "@/services/authService";
import { useRouter } from "@/i18n/navigation";

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
    const t = useTranslations("toasts");
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation<RegisterResponse, ApiError, RegisterRequest>({
        mutationFn: register,

        onSuccess: (data) => {
            toast.success(t("registerSuccess"));
            queryClient.setQueryData(["user"], data.user);
            router.push("/");
            router.refresh();
        },

        onError: () => {
            toast.error(t("registerFailed"));
        },
    });
};
