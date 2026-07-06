"use client";

import { usePathname } from "@/i18n/navigation";

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
    const segments = pathname.split("/").filter(Boolean);
    const isAdmin = segments[1] === "admin";

    return (
        <>
            {!isAdmin && headerSlot}
            {children}
            {!isAdmin && footerSlot}
        </>
    );
}
