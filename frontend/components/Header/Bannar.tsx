"use client";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import Container from "../Container";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Banner() {
    const t = useTranslations('nav');
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    return (
        <div className="bg-black text-white">
            <Container className="relative flex items-center justify-center py-3 px-4">
                <p className="text-xs sm:text-sm text-center pe-16 sm:pe-0">
                    {t('summerSale')}{" "}

                    <a href="/sale"
                        className="underline font-semibold hover:text-gray-300 transition"
                    >
                        {t('shopNow')}
                    </a>
                </p>

                <div className="absolute end-4 flex items-center gap-3">
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
        </div >
    );
}