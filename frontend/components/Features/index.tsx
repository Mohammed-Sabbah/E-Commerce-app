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

function Features() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-16">
            <FeatureItem
                icon={Truck}
                title="FREE AND FAST DELIVERY"
                description="Free delivery for all orders over $140"
            />
            <FeatureItem
                icon={Headphones}
                title="24/7 CUSTOMER SERVICE"
                description="Friendly 24/7 customer support"
            />
            <FeatureItem
                icon={ShieldCheck}
                title="MONEY BACK GUARANTEE"
                description="We return money within 30 days"
            />
        </div>
    );
}

export default Features;