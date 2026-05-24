import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logout,

        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["user"] });
            router.push("/login");
            router.refresh();
        },
    });
};