"use client";

import { useLocale, useTranslations } from "next-intl";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { chartText, chartTooltipStyle, isRtlLocale } from "./chartConfig";

interface Props {
    data: { _id: string; revenue: number }[];
}

export default function RevenueChart({ data }: Props) {
    const t = useTranslations('admin');
    const locale = useLocale();
    const isRtl = isRtlLocale(locale);
    if (!data.length) return <p className="text-sm text-gray-400">{t('noOrders')}</p>;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('revenueOverview')}</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={isRtl ? { top: 5, right: 8, bottom: 0, left: 24 } : { top: 5, right: 24, bottom: 0, left: 8 }}>
                        <defs>
                            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#DB4444" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#DB4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="_id" tick={chartText(false)} tickMargin={8} stroke="#9ca3af" />
                        <YAxis
                            orientation={isRtl ? "right" : "left"}
                            tick={chartText(false)}
                            tickMargin={8}
                            stroke="#9ca3af"
                        />
                        <Tooltip
                            contentStyle={chartTooltipStyle(isRtl)}
                            formatter={(v) => [`$${Number(v).toLocaleString("en")}`, t('totalRevenue')]}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#DB4444"
                            strokeWidth={2}
                            fill="url(#revenueGrad)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
