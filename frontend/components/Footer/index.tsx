import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation'
import React from 'react'

async function Footer() {
    const t = await getTranslations('footer');
    return (
        <footer className="bg-black text-white py-10">
            <div className="container mx-auto px-6 md:px-10 lg:px-14">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">

                    <div className="sm:col-span-2 lg:col-span-1 space-y-4">
                        <h3 className="text-xl font-bold">{t('exclusive')}</h3>
                        <p className="text-base font-medium">{t('subscribe')}</p>
                        <p className="text-sm text-gray-400">{t('getDiscount')}</p>
                        <div className="flex border border-gray-600 max-w-xs">
                            <input
                                className="bg-transparent flex-1 min-w-0 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none"
                                type="email"
                                placeholder={t('enterEmail')}
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 border-l border-gray-600 text-gray-300 hover:text-white text-sm transition-colors"
                                aria-label={t('subscribeButton')}
                            >
                                →
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-base font-semibold">{t('support')}</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>{t('address')}</li>
                            <li>{t('email')}</li>
                            <li>{t('phone')}</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-base font-semibold">{t('account')}</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">{t('myAccount')}</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">{t('loginRegister')}</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">{t('cart')}</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">{t('wishlist')}</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">{t('shop')}</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-base font-semibold">{t('quickLinks')}</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">{t('termsOfUse')}</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">{t('faq')}</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">{t('contact')}</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-base font-semibold">{t('downloadApp')}</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">{t('womensFashion')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{t('mensFashion')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{t('electronics')}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{t('accessories')}</a></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
                    {t('copyright', { year: new Date().getFullYear() })}
                </div>
            </div>
        </footer>
    )
}

export default Footer
