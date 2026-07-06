import { getTranslations } from 'next-intl/server';
import Container from "@/components/Container";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/navigation";

export default async function ContactPage() {
    const tnav = await getTranslations('nav');
    const t = await getTranslations('contact');

    return (
        <main>
            <Container className="py-8 md:py-14">

                <nav className="text-sm text-gray-500 mb-10">
                    <Link href="/" className="hover:underline">{tnav('home')}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-black font-medium">{t('title')}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-6">

                    <aside className="w-full lg:w-1/3 border border-gray-200 rounded shadow-sm p-6 flex flex-col gap-8">

                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-red-500 text-white rounded-full p-2 flex items-center justify-center">
                                    <PhoneIcon className="w-4 h-4" />
                                </span>
                                <h3 className="font-semibold text-base">{t('callToUs')}</h3>
                            </div>
                            <p className="text-sm text-gray-500">{t('available247')}</p>
                            <p className="text-sm mt-2">{t('phone')} +88016-11112222</p>
                        </div>

                        <hr className="border-gray-200" />

                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-red-500 text-white rounded-full p-2 flex items-center justify-center">
                                    <EnvelopeIcon className="w-4 h-4" />
                                </span>
                                <h3 className="font-semibold text-base">{t('writeToUs')}</h3>
                            </div>
                            <p className="text-sm text-gray-500">
                                {t('formDescription')}
                            </p>
                            <p className="text-sm mt-2">{t('emails')} customer@exclusive.com</p>
                            <p className="text-sm">{t('emails')} support@exclusive.com</p>
                        </div>

                    </aside>

                    <section className="flex-1 border border-gray-200 rounded shadow-sm p-6">

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder={t('yourName')}
                                className="border border-gray-200 bg-gray-50 rounded px-4 py-3 text-sm outline-none focus:border-red-400 transition w-full"
                            />
                            <input
                                type="email"
                                placeholder={t('yourEmail')}
                                className="border border-gray-200 bg-gray-50 rounded px-4 py-3 text-sm outline-none focus:border-red-400 transition w-full"
                            />
                            <input
                                type="tel"
                                placeholder={t('yourPhone')}
                                className="border border-gray-200 bg-gray-50 rounded px-4 py-3 text-sm outline-none focus:border-red-400 transition w-full"
                            />
                        </div>

                        <textarea
                            placeholder={t('yourMessage')}
                            rows={8}
                            className="w-full border border-gray-200 bg-gray-50 rounded px-4 py-3 text-sm outline-none focus:border-red-400 transition resize-none"
                        />

                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-600 active:scale-95 text-white px-8 py-3 rounded text-sm font-medium transition-all duration-200"
                            >
                                {t('sendMessage')}
                            </button>
                        </div>

                    </section>
                </div>
            </Container>
        </main>
    );
}