// import { useRouter } from "next/navigation";

// interface UseAuthGuardProps {
//     user: any; // أو نوع المستخدم عندك
//     redirectToLogin?: boolean;
// }

// export function useAuthGuard({ user, redirectToLogin = false }: UseAuthGuardProps) {
//     const router = useRouter();

//     const requireAuth = () => {
//         if (!user) {
//             if (redirectToLogin) {
//                 router.push("/login");
//             } else {
//                 toast.error("You have to be logged in ");
//             }
//             return false;
//         }
//         return true;
//     };

//     return { requireAuth };
// }