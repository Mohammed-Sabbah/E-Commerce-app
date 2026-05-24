import { getMyProfile } from '@/services/server/userService';
import CheckoutClient from '@/components/checkoutComponents/CheckoutClient';

export default async function CheckoutPage() {
    const user = await getMyProfile();

    const addresses = user?.addresses ?? [];

    const initialBilling = {
        firstName: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        companyName: '',
        street: user?.addresses?.[0]?.details ?? '',
        apartment: '',
        city: user?.addresses?.[0]?.city ?? '',
        saveInfo: true,
    };

    return (
        <main className="max-w-6xl mx-auto px-4 py-10">
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
                addresses={addresses}
                initialBilling={initialBilling}
            />
        </main>
    );
}