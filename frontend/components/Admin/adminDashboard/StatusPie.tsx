"use client";

import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS: Record<string, string> = {
    pending: "#F59E0B",
    processing: "#3B82F6",
    delivered: "#10B981",
    cancelled: "#EF4444",
    returned: "#8B5CF6",
};

interface Props {
    data: { _id: string; count: number }[];
}

export default function StatusPie({ data }: Props) {
    const t = useTranslations('admin');
    if (!data.length) return <p className="text-sm text-gray-400">{t('noOrders')}</p>;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('ordersByStatus')}</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="_id"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={50}
                            paddingAngle={3}
                        >
                            {data.map((entry) => (
                                <Cell key={entry._id} fill={COLORS[entry._id] ?? "#9CA3AF"} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
                        />
                        <Legend
                            formatter={(value: string) => (
                                <span className="text-sm text-gray-700 capitalize">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
