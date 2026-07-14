'use client';

import { useTranslations } from 'next-intl';
import { BillingData } from '@/types/checkout';

const inputCls =
    'w-full h-11 px-4 bg-gray-100 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none cursor-default';

function Field({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-700">
                {label}
                {required && <span className="text-red-500 ms-0.5">*</span>}
            </label>
            {children}
        </div>
    );
}

interface Props {
    value: BillingData;
}

export default function BillingForm({ value }: Props) {
    const t = useTranslations('checkout');
    return (
        <div className="flex flex-col gap-5">
            <Field label={t('firstName')} required>
                <input readOnly name="firstName" value={value.firstName} className={inputCls} />
            </Field>

            <Field label={t('companyName')}>
                <input readOnly name="companyName" value={value.companyName} className={inputCls} />
            </Field>

            <Field label={t('address')} required>
                <input readOnly name="street" value={value.street} className={inputCls} />
            </Field>

            <Field label={t('apartment')}>
                <input readOnly name="apartment" value={value.apartment} className={inputCls} />
            </Field>

            <Field label={t('city')} required>
                <input readOnly name="city" value={value.city} className={inputCls} />
            </Field>

            <Field label={t('phone')} required>
                <input readOnly name="phone" type="tel" value={value.phone} className={inputCls} />
            </Field>

            <Field label={t('email')} required>
                <input readOnly name="email" type="email" value={value.email} className={inputCls} />
            </Field>
        </div>
    );
}