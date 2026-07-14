"use client";

import { useLocale, useTranslations } from "next-intl";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { chartText, chartTooltipStyle, isRtlLocale } from "./chartConfig";

interface Props {
    data: { name: string; quantity: number; revenue: number }[];
}

type ProductNameTickProps = {
    x?: number | string;
    y?: number | string;
    payload?: { value: string };
    isRtl: boolean;
};

function ProductNameTick({ x = 0, y = 0, payload, isRtl }: ProductNameTickProps) {
    const tickX = Number(x);
    const tickY = Number(y);

    return (
        <text
            x={tickX}
            y={tickY}
            dy={4}
            textAnchor="end"
            direction={isRtl ? "rtl" : "ltr"}
            style={{ fontSize: 11, fill: "#6b7280" }}
        >
            {payload?.value}
        </text>
    );
}

export default function TopProducts({ data }: Props) {
    const t = useTranslations('admin');
    const locale = useLocale();
    const isRtl = isRtlLocale(locale);
    if (!data.length) return <p className="text-sm text-gray-400">{t('noProducts')}</p>;

    const reversed = [...data].reverse();

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('topProducts')}</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={reversed}
                        layout="vertical"
                        margin={isRtl ? { top: 5, right: 18, bottom: 0, left: 24 } : { top: 5, right: 24, bottom: 0, left: 18 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                        <XAxis
                            type="number"
                            orientation="bottom"
                            tick={chartText(false)}
                            tickMargin={8}
                            stroke="#9ca3af"
                            reversed={isRtl}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            orientation={isRtl ? "right" : "left"}
                            tick={(props) => <ProductNameTick {...props} isRtl={isRtl} />}
                            tickMargin={8}
                            stroke="#9ca3af"
                            width={150}
                        />
                        <Tooltip
                            contentStyle={chartTooltipStyle(isRtl)}
                            formatter={(v, name) => [
                                name === "revenue" ? `$${Number(v).toLocaleString("en")}` : v,
                                name === "quantity" ? t('sold') : t('totalRevenue'),
                            ]}
                        />
                        <Bar dataKey="quantity" fill="#DB4444" radius={isRtl ? [4, 0, 0, 4] : [0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
