import Image from 'next/image'
import StyledButton from '../StyledButton'
import { useTranslations } from 'next-intl';
function CatigoryHero() {
    const t = useTranslations('products');
    return (
        <div className="px-6 md:px-10 lg:px-14 py-10 md:py-12 lg:py-17 bg-black flex flex-col lg:flex-row justify-between items-center gap-8">

            <div className="w-full lg:w-2/5 flex flex-col space-y-6 lg:space-y-8">
                <h3 className="text-[1rem] rtl:text-[1.125rem] text-[#00FF66] font-semibold">{t('categories')}</h3>
                <p className="text-3xl md:text-4xl lg:text-5xl rtl:text-4xl rtl:md:text-5xl rtl:lg:text-6xl text-[#FAFAFA] font-semibold tracking-[4%]">
                    {t('enhanceMusic')}
                </p>
                <CatigoryHeroTimer />
                <div className="hidden lg:block">
                    <StyledButton
                        title={t('buyNow')}
                        ClassName="hero-button self-start bg-[#00FF66] py-4 px-12 text-white inline-block"
                    />
                </div>
            </div>

            {/* الصورة — أكبر على التابلت */}
            <div className="relative w-full lg:w-3/5 aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[4/3] min-h-[280px] lg:min-h-[320px]">

                {/* الهالة البيضاء */}
                <div className="pointer-events-none absolute start-1/2 top-1/2 z-0
        h-[60%] w-[60%]
        -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-[100px]" />

                <Image
                    src="/images/3cc943ca7e210f637fc0504b7d93cd207df744c2.png"
                    alt={t('heroImageAlt')}
                    fill
                    className="relative z-10 scale-x-[-1] object-contain"
                    sizes="(min-width: 1024px) 60vw, (min-width: 768px) 100vw, 100vw"
                    priority
                />
            </div>

            <div className="lg:hidden w-full">
                <StyledButton
                    title={t('buyNow')}
                    ClassName="hero-button bg-[#00FF66] py-4 px-12 text-white inline-block"
                />
            </div>
        </div>
    )
}

export function CatigoryHeroTimerItem({ value, label }: { value: number; label: string }) {
    const TheValue = value.toString().padStart(2, '0');
    return (
        <div className='w-12 h-12 md:w-14 md:h-14 lg:w-15.5 lg:h-15.5 rounded-full bg-white text-black flex flex-col justify-center items-center'>
            <h3 className='text-[0.8rem] md:text-[0.9rem] lg:text-[1rem] font-[600]'>{TheValue}</h3>
            <p className='text-[0.55rem] md:text-[0.6rem] lg:text-[0.7rem] font-[400]'>{label}</p>
        </div>
    )
}

export function CatigoryHeroTimer() {
    const t = useTranslations('products');
    return (
        <div className='flex space-x-3 md:space-x-4 lg:space-x-6 '>
            <CatigoryHeroTimerItem label={t('days')} value={5} />
            <CatigoryHeroTimerItem label={t('hours')} value={23} />
            <CatigoryHeroTimerItem label={t('minutes')} value={59} />
            <CatigoryHeroTimerItem label={t('seconds')} value={45} />
        </div>
    )
}

export default CatigoryHero