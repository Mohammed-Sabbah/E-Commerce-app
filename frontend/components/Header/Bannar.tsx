"use client";
import { useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import Container from "../Container";

export function Banner() {
    const t = useTranslations('nav');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    function handleLocaleChange(newLocale: string) {
        router.push(pathname, { locale: newLocale });
    }

    return (
        <div className="bg-black text-white">
            <Container className="relative flex items-center justify-center py-3 px-4">
                <p className="text-xs sm:text-sm text-center pr-16 sm:pr-0">
                    {t('summerSale')}{" "}

                    <a href="/sale"
                        className="underline font-semibold hover:text-gray-300 transition"
                    >
                        {t('shopNow')}
                    </a>
                </p>

                <div className="absolute right-4 flex items-center gap-3">
                    <select
                        className="bg-transparent text-xs sm:text-sm text-gray-300 
                                   hover:text-white transition cursor-pointer 
                                   appearance-none border-none outline-none"
                        value={locale}
                        onChange={(e) => handleLocaleChange(e.target.value)}
                        aria-label={t('selectLanguage')}
                    >
                        <option value="en" className="bg-black">{t('english')}</option>
                        <option value="ar" className="bg-black">{t('arabic')}</option>
                    </select>

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