import Link from "next/link";
import { getMyProfile } from "@/services/server/userService";
import Container from "@/components/Container";
import AccountSidebar from "@/components/Account/AccountSidebar";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const profile = await getMyProfile();

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-white">
            <Container className="py-10">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-gray-800 transition">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-gray-800">My Account</span>
                    <span className="ml-auto text-sm">
                        Welcome!{" "}
                        <span className="text-[#DB4444] font-medium">{profile.name}</span>
                    </span>
                </nav>

                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    <AccountSidebar />
                    <main className="flex-1 bg-white shadow-sm rounded-md p-6 sm:p-8 lg:p-10">
                        {children}
                    </main>
                </div>

            </Container>
        </div>
    );
}