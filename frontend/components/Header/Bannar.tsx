"use client";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import Container from "../Container";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Banner() {
    const t = useTranslations('nav');
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    return (
        <div className="bg-black text-white">
            <Container className="flex items-center gap-3 py-2.5 px-3 sm:relative sm:justify-center sm:py-3 sm:px-4">
                <p className="min-w-0 flex-1 text-xs leading-5 sm:flex-none sm:text-sm sm:text-center sm:px-16">
                    {t('summerSale')}{" "}

                    <Link href="/sale"
                        className="underline font-semibold hover:text-gray-300 transition"
                    >
                        {t('shopNow')}
                    </Link>
                </p>

                <div className="shrink-0 flex items-center gap-2 sm:absolute sm:end-4 sm:gap-3">
                    <LanguageSwitcher />

                    <button
                        onClick={() => setVisible(false)}
                        className="text-gray-400 hover:text-white transition text-lg leading-none"
                        aria-label={t('closeBanner')}
                    >
                        ×
                    </button>
                </div>
            </Container>
        </div>
    );
}