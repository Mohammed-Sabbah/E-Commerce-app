'use client';

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
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
        </div>
    );
}

interface Props {
    value: BillingData;
}

export default function BillingForm({ value }: Props) {
    return (
        <div className="flex flex-col gap-5">
            <Field label="First Name" required>
                <input readOnly name="firstName" value={value.firstName} className={inputCls} />
            </Field>

            <Field label="Company Name">
                <input readOnly name="companyName" value={value.companyName} className={inputCls} />
            </Field>

            <Field label="Street Address" required>
                <input readOnly name="street" value={value.street} className={inputCls} />
            </Field>

            <Field label="Apartment, floor, etc. (optional)">
                <input readOnly name="apartment" value={value.apartment} className={inputCls} />
            </Field>

            <Field label="Town / City" required>
                <input readOnly name="city" value={value.city} className={inputCls} />
            </Field>

            <Field label="Phone Number" required>
                <input readOnly name="phone" type="tel" value={value.phone} className={inputCls} />
            </Field>

            <Field label="Email Address" required>
                <input readOnly name="email" type="email" value={value.email} className={inputCls} />
            </Field>
        </div>
    );
}