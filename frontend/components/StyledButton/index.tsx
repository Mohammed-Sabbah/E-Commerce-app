'use client';

import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation"
import { cn } from '@/lib/utils'
import LoadingSvg from '../LoadingSvg'

export default function StyledButton({
    title,
    ClassName,
    type,
    isLoading,
    loadingText,
    href,
}: {
    title: string
    ClassName?: string
    type?: "button" | "reset" | "submit"
    isLoading?: boolean
    loadingText?: string
    href?: string
}) {
    const t = useTranslations('common');
    const content = isLoading ? (
        <span className="flex items-center gap-2">
            <LoadingSvg />
            {loadingText ?? t('loading')}
        </span>
    ) : title

    const classes = cn(
        `bg-[#DB4444] text-white px-12 py-4 rounded-lg disabled:bg-[#e88080]`,
        ClassName
    )

    if (href) {
        return (
            <Link href={href} className={classes}>
                {content}
            </Link>
        )
    }

    return (
        <button type={type} disabled={isLoading} className={classes}>
            {content}
        </button>
    )
}