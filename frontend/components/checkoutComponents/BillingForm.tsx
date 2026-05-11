'use client';

import { BillingData } from '@/types/checkout';

const inputCls =
    'w-full h-11 px-4 bg-gray-100 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all';

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
    onChange: (data: BillingData) => void;
}

export default function BillingForm({ value, onChange }: Props) {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value: val, type, checked } = e.target;
        onChange({ ...value, [name]: type === 'checkbox' ? checked : val });
    };

    return (
        <div className="flex flex-col gap-5">
            <Field label="First Name" required>
                <input
                    name="firstName"
                    value={value.firstName}
                    onChange={handleInput}
                    className={inputCls}
                />
            </Field>

            <Field label="Company Name">
                <input
                    name="companyName"
                    value={value.companyName}
                    onChange={handleInput}
                    className={inputCls}
                />
            </Field>

            <Field label="Street Address" required>
                <input
                    name="street"
                    value={value.street}
                    onChange={handleInput}
                    className={inputCls}
                />
            </Field>

            <Field label="Apartment, floor, etc. (optional)">
                <input
                    name="apartment"
                    value={value.apartment}
                    onChange={handleInput}
                    className={inputCls}
                />
            </Field>

            <Field label="Town / City" required>
                <input
                    name="city"
                    value={value.city}
                    onChange={handleInput}
                    className={inputCls}
                />
            </Field>

            <Field label="Phone Number" required>
                <input
                    name="phone"
                    type="tel"
                    value={value.phone}
                    onChange={handleInput}
                    className={inputCls}
                />
            </Field>

            <Field label="Email Address" required>
                <input
                    name="email"
                    type="email"
                    value={value.email}
                    onChange={handleInput}
                    className={inputCls}
                />
            </Field>

            <label className="flex items-center gap-3 cursor-pointer mt-1">
                <input
                    type="checkbox"
                    name="saveInfo"
                    checked={value.saveInfo}
                    onChange={handleInput}
                    className="w-4 h-4 accent-red-500"
                />
                <span className="text-sm text-gray-700">
                    Save this information for faster check-out next time
                </span>
            </label>
        </div>
    );
}