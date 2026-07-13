import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { resetPassword } from "@/services/authService";
import { useRouter } from "@/i18n/navigation";

interface ApiError {
    response?: { data?: { message: string } };
    message?: string;
}

export const useResetPassword = () => {
    const t = useTranslations("toasts");
    const router = useRouter();

    return useMutation<{ status: string }, ApiError, { email: string; newPassword: string; confirmNewPassword: string }>({
        mutationFn: resetPassword,

        onSuccess: () => {
            toast.success(t("passwordReset"));
            router.push("/login");
        },

        onError: (error) => {
            toast.error(error.response?.data?.message || t("somethingWentWrong"));
        },
    });
};
