interface Props {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export default function AdminPageHeader({ title, subtitle, children }: Props) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
            <div className="min-w-0">
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
    );
}
