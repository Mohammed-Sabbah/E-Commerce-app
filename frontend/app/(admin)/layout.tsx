import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/Admin/AdminSidebar";

export const metadata = { title: "Admin — Exclusive" };

const API = process.env.API_URL;

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    if (!API) return <div className="p-8 text-red-500">API_URL is not configured</div>;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let user: { name: string; email: string; role: string } | null = null;
    try {
        const res = await fetch(`${API}/api/v1/users/myProfile`, {
            headers: { Cookie: `token=${token}` },
            next: { revalidate: 300 },
        });
        if (!res.ok) redirect("/login");
        const data = await res.json();
        user = data?.data?.doc;
    } catch {
        redirect("/login");
    }

    if (!user || user.role !== "admin") redirect("/");

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar user={{ name: user.name, email: user.email }} />
            <main className="flex-1 overflow-y-auto">
                <div className="p-5 md:p-7 lg:p-9">
                    {children}
                </div>
            </main>
        </div>
    );
}
