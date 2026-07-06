'use client'

import { useTranslations } from 'next-intl';

const COLOR_MAP: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    black: '#000000',
    white: '#ffffff',
    gray: '#6b7280',
    yellow: '#eab308',
    pink: '#ec4899',
    purple: '#a855f7',
    orange: '#f97316',
    brown: '#92400e',
}

interface Props {
    colors: string[]
    sizes: string[]
    selectedColor: string | null
    selectedSize: string | null
    onColorChange: (color: string) => void
    onSizeChange: (size: string) => void
}

export default function ProductOptions({
    colors,
    sizes,
    selectedColor,
    selectedSize,
    onColorChange,
    onSizeChange,
}: Props) {
    const t = useTranslations('products');
    return (
        <div className="flex flex-col gap-4">
            {/* Colors */}
            {colors.length > 0 && (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-14">{t('colours')}</span>
                    <div className="flex items-center gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                title={color}
                                onClick={() => onColorChange(color)}
                                className={`w-5 h-5 rounded-full border-2 transition-all ${selectedColor === color
                                        ? 'border-gray-800 scale-110'
                                        : 'border-transparent hover:border-gray-400'
                                    }`}
                                style={{ backgroundColor: COLOR_MAP[color] ?? color }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-14">{t('sizeLabel')}</span>
                    <div className="flex items-center gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => onSizeChange(size)}
                                className={`w-9 h-9 text-xs rounded border transition-all ${selectedSize === size
                                        ? 'bg-red-500 text-white border-red-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}