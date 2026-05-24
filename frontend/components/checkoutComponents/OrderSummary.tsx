import Image from 'next/image';
import { OrderItem } from '@/types/checkout';

interface Props {
    items: OrderItem[];
    discount: number;
}

function SummaryRow({
    label,
    value,
    divider,
    highlight,
}: {
    label: string;
    value: string;
    divider?: boolean;
    highlight?: boolean;
}) {
    return (
        <div className={`flex justify-between text-sm ${divider ? 'border-t border-gray-200 pt-3' : ''}`}>
            <span className="text-gray-600">{label}:</span>
            <span className={`font-medium ${highlight ? 'text-green-600' : 'text-gray-900'}`}>
                {value}
            </span>
        </div>
    );
}
export default function OrderSummary({ items, discount }: Props) {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const afterDiscount = subtotal - discount;
    const tax = parseFloat((afterDiscount * 0.025).toFixed(2));
    const shipping = parseFloat((afterDiscount * 0.025).toFixed(2));
    const total = parseFloat((afterDiscount + tax + shipping).toFixed(2));

    return (
        <div className="flex flex-col gap-5">
            {/* Items — نفس الكود */}
            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                            </div>
                            <span className="text-sm text-gray-800 truncate">
                                {item.name}
                                {item.quantity > 1 && <span className="text-gray-400 ml-1">×{item.quantity}</span>}
                            </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 flex-shrink-0">
                            ${(item.price * item.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-3">
                <SummaryRow label="Subtotal" value={`$${afterDiscount.toFixed(2)}`} />
                {discount > 0 && (
                    <SummaryRow label="Discount" value={`-$${discount.toFixed(2)}`} highlight />
                )}
                <SummaryRow label="Tax (2.5%)" value={`$${tax.toFixed(2)}`} divider />
                <SummaryRow label="Shipping (2.5%)" value={`$${shipping.toFixed(2)}`} />
                <SummaryRow label="Total" value={`$${total.toFixed(2)}`} divider />
            </div>
        </div>
    );
}