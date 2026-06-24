"use client";

import { usePathname } from "next/navigation";

export default function LayoutShell({
    children,
    headerSlot,
    footerSlot,
}: {
    children: React.ReactNode;
    headerSlot: React.ReactNode;
    footerSlot: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    return (
        <>
            {!isAdmin && headerSlot}
            {children}
            {!isAdmin && footerSlot}
        </>
    );
}
