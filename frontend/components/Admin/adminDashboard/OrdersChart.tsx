"use client";

import { useLocale, useTranslations } from "next-intl";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { chartText, chartTooltipStyle, isRtlLocale } from "./chartConfig";

interface Props {
    data: { _id: string; count: number }[];
}

export default function OrdersChart({ data }: Props) {
    const t = useTranslations('admin');
    const locale = useLocale();
    const isRtl = isRtlLocale(locale);
    if (!data.length) return <p className="text-sm text-gray-400">{t('noOrders')}</p>;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('monthlyOrders')}</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={isRtl ? { top: 5, right: 8, bottom: 0, left: 24 } : { top: 5, right: 24, bottom: 0, left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="_id" tick={chartText(false)} tickMargin={8} stroke="#9ca3af" />
                        <YAxis
                            orientation={isRtl ? "right" : "left"}
                            tick={chartText(false)}
                            tickMargin={8}
                            stroke="#9ca3af"
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={chartTooltipStyle(isRtl)}
                            formatter={(v) => [v, t('orders')]}
                        />
                        <Bar dataKey="count" fill="#DB4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
