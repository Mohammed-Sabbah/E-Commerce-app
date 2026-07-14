import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { logout } from "@/services/authService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useLogout = () => {
    const t = useTranslations("toasts");
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logout,

        onSuccess: () => {
            toast.success(t("logoutSuccess"));
            queryClient.removeQueries({ queryKey: QUERY_KEYS.CART });
            queryClient.removeQueries({ queryKey: QUERY_KEYS.WISHLIST });
            router.push("/login");
            router.refresh();
        },
    });
};