"use client";

import { useTranslations } from "next-intl";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface Props {
    data: { name: string; quantity: number; revenue: number }[];
}

export default function TopProducts({ data }: Props) {
    const t = useTranslations('admin');
    if (!data.length) return <p className="text-sm text-gray-400">{t('noProducts')}</p>;

    const reversed = [...data].reverse();

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('topProducts')}</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reversed} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            stroke="#9ca3af"
                            width={120}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
                            formatter={(v, name) => [
                                name === "revenue" ? `$${Number(v).toLocaleString("en")}` : v,
                                name === "quantity" ? t('sold') : t('totalRevenue'),
                            ]}
                        />
                        <Bar dataKey="quantity" fill="#DB4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
