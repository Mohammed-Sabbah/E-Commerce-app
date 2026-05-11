import { getMyProfile } from '@/services/server/userService';
import { getProductById } from '@/services/server/pruductService';
import { BillingData, OrderItem } from '@/types/checkout';
import CheckoutClient from '@/components/checkoutComponents/CheckoutClient';

interface Props {
    searchParams: Promise<{
        productId?: string;
        qty?: string;
        color?: string;
    }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
    const { productId, qty, color } = await searchParams;

    const user = await getMyProfile();

    const initialBilling: BillingData = {
        firstName: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        companyName: '',
        street: user?.addresses?.[0]?.street ?? '',
        apartment: user?.addresses?.[0]?.apartment ?? '',
        city: user?.addresses?.[0]?.city ?? '',
        saveInfo: true,
    };

    // ── Buy Now: جيب المنتج من الـ DB على السيرفر ──────────────────────────
    let buyNowItem: OrderItem | null = null;

    if (productId) {
        try {
            const res = await getProductById(productId);
            const product = res.data.doc;

            buyNowItem = {
                _id: product._id,
                name: product.name,
                price: product.priceAfterDiscount ?? product.price,
                quantity: Number(qty) || 1,
                image: product.coverImage ?? product.images?.[0] ?? '',
                color: color ?? '',
            };
        } catch {
            // المنتج ما لقيناه — نعامله كـ cart checkout
            buyNowItem = null;
        }
    }

    return (
        <main className="max-w-6xl mx-auto px-4 py-10">

            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-10">
                {['Account', 'My Account', 'Product', 'View Cart', 'CheckOut'].map((crumb, i, arr) => (
                    <span key={crumb} className="flex items-center gap-2">
                        <span className={i === arr.length - 1 ? 'text-gray-900 font-medium' : ''}>
                            {crumb}
                        </span>
                        {i < arr.length - 1 && <span>/</span>}
                    </span>
                ))}
            </nav>

            <CheckoutClient
                initialBilling={initialBilling}
                buyNowItem={buyNowItem}
            />
        </main>
    );
}