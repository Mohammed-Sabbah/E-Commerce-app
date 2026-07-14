import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { forgetPassword } from "@/services/authService";
import { useRouter } from "@/i18n/navigation";

interface ApiError {
    response?: { data?: { message: string } };
    message?: string;
}

export const useForgetPassword = () => {
    const t = useTranslations("toasts");
    const router = useRouter();

    return useMutation<{ status: string }, ApiError, { email: string }>({
        mutationFn: forgetPassword,

        onSuccess: (_data, variables) => {
            toast.success(t("codeSent"));
            router.push(`/reset-password?email=${encodeURIComponent(variables.email)}`);
        },

        onError: (error) => {
            toast.error(error.response?.data?.message || t("somethingWentWrong"));
        },
    });
};
