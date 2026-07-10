import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import AdminSidebar from "@/components/Admin/AdminSidebar";

export const metadata = { title: "Admin — Exclusive" };

const API = process.env.API_URL;

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!API) return <div className="p-8 text-red-500">API_URL is not configured</div>;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect({ href: "/login", locale });

    let user: { name: string; email: string; role: string };
    try {
        const res = await fetch(`${API}/api/v1/users/myProfile`, {
            headers: { Cookie: `token=${token}` },
            cache: "no-store",
        });
        if (!res.ok) { redirect({ href: "/login", locale }); return null; }
        const data = await res.json();
        const u = data?.data?.doc;
        if (!u || u.role !== "admin") { redirect({ href: "/", locale }); return null; }
        user = u;
    } catch {
        redirect({ href: "/login", locale });
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar user={{ name: user.name, email: user.email }} />
            <main className="flex-1 overflow-y-auto">
                <div className="pt-20 px-5 pb-5 md:p-7 lg:p-9">
                    {children}
                </div>
            </main>
        </div>
    );
}
