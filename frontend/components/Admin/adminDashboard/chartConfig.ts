export function isRtlLocale(locale: string) {
    return locale === "ar";
}

export function chartText(isRtl: boolean) {
    return {
        fontSize: 11,
        fill: "#6b7280",
        direction: isRtl ? "rtl" : "ltr",
    };
}

export function chartTooltipStyle(isRtl: boolean) {
    return {
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        fontSize: 13,
        direction: isRtl ? "rtl" : "ltr",
        textAlign: isRtl ? "right" : "left",
    } as const;
}
