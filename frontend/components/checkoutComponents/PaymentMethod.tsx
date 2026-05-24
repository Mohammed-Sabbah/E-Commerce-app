'use client';

import { PaymentMethod } from '@/types/checkout';

interface Props {
    value: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
}

function RadioDot({ checked }: { checked: boolean }) {
    return (
        <span
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                checked ? 'border-gray-800' : 'border-gray-400'
            }`}
        >
            {checked && <span className="w-2 h-2 rounded-full bg-gray-800 block" />}
        </span>
    );
}

export default function PaymentMethodSelector({ value, onChange }: Props) {
    return (
        <div className="flex flex-col gap-2">
            {/* Bank */}
            <button
                type="button"
                onClick={() => onChange('card')}
                className={`flex items-center justify-between p-3 rounded border w-full transition-colors ${
                    value === 'card'
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                }`}
            >
                <div className="flex items-center gap-2">
                    <RadioDot checked={value === 'card'} />
                    <span className="text-sm text-gray-700">Bank</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold tracking-wide">
                        VISA
                    </span>
                    <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">
                        MC
                    </span>
                </div>
            </button>

            {value === 'card' && (
                <p className="text-xs text-gray-400 pl-2">
                    Online payment coming soon. Please use Cash on Delivery.
                </p>
            )}

            {/* Cash on Delivery */}
            <button
                type="button"
                onClick={() => onChange('cash')}
                className={`flex items-center gap-2 p-3 rounded border w-full transition-colors ${
                    value === 'cash'
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                }`}
            >
                <RadioDot checked={value === 'cash'} />
                <span className="text-sm text-gray-700">Cash on Delivery</span>
            </button>
        </div>
    );
}