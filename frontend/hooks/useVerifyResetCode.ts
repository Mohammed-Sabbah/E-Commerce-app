import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { verifyResetCode } from "@/services/authService";

interface ApiError {
    response?: { data?: { message: string } };
    message?: string;
}

export const useVerifyResetCode = () => {
    const t = useTranslations("toasts");

    return useMutation<{ status: string }, ApiError, { resetCode: string }>({
        mutationFn: verifyResetCode,

        onSuccess: () => {
            toast.success(t("codeVerified"));
        },

        onError: (error) => {
            toast.error(error.response?.data?.message || t("invalidCode"));
        },
    });
};
