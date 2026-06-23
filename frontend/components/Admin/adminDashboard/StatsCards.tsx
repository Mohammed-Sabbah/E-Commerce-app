"use client";

import { ShoppingCart, DollarSign, Users, Package } from "lucide-react";

interface Props {
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalProducts: number;
}

const cards = [
    { label: "Total Orders", get: (s: Props) => s.totalOrders, icon: ShoppingCart, color: "text-blue-600 bg-blue-100" },
    { label: "Revenue", get: (s: Props) => `$${s.totalRevenue.toLocaleString("en")}`, icon: DollarSign, color: "text-green-600 bg-green-100" },
    { label: "Customers", get: (s: Props) => s.totalUsers, icon: Users, color: "text-purple-600 bg-purple-100" },
    { label: "Products", get: (s: Props) => s.totalProducts, icon: Package, color: "text-orange-600 bg-orange-100" },
];

export default function StatsCards(props: Props) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(({ label, get, icon: Icon, color }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                        <p className="text-xl font-bold text-gray-900 mt-0.5">{get(props)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
