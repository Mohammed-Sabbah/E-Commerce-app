"use client";

import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";

interface CartActionsProps {
    onUpdate: () => void;
}

export default function CartActions({ onUpdate }: CartActionsProps) {
    const t = useTranslations('cart');

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <Link
                href="/"
                className="border border-black rounded-md px-6 py-3 text-center hover:bg-black hover:text-white transition"
            >
                {t('returnToShop')}
            </Link>

            <button
                onClick={onUpdate}
                className="border border-black rounded-md px-6 py-3 hover:bg-black hover:text-white transition cursor-pointer"
            >
                {t('updateCart')}
            </button>
        </div>
    );
}