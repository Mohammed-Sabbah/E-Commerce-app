import { getTranslations } from 'next-intl/server';
import { Truck, Headphones, ShieldCheck } from "lucide-react";

// ────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────

function FeatureItem({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-gray-300 rounded-full p-3">
                <div className="bg-black rounded-full p-4">
                    <Icon className="w-8 h-8 text-white" />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wide">{title}</h3>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );
}

// ────────────────────────────────────────
// Main Component
// ────────────────────────────────────────

async function Features() {
    const t = await getTranslations('features');
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-16">
            <FeatureItem
                icon={Truck}
                title={t('freeDelivery')}
                description={t('freeDeliveryDesc')}
            />
            <FeatureItem
                icon={Headphones}
                title={t('customerService')}
                description={t('customerServiceDesc')}
            />
            <FeatureItem
                icon={ShieldCheck}
                title={t('moneyBack')}
                description={t('moneyBackDesc')}
            />
        </div>
    );
}

export default Features;