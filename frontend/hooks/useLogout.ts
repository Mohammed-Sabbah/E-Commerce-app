import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { logout } from "@/services/authService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logout,

        onSuccess: () => {
            queryClient.removeQueries({ queryKey: QUERY_KEYS.CART });
            queryClient.removeQueries({ queryKey: QUERY_KEYS.WISHLIST });
            router.push("/login");
            router.refresh();
        },
    });
};