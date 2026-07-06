export default function Loading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-1">
                <div className="h-6 w-36 bg-gray-200 rounded" />
                <div className="h-4 w-52 bg-gray-100 rounded" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-72 bg-gray-200 rounded-xl" />
                <div className="h-72 bg-gray-200 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-72 bg-gray-200 rounded-xl" />
                <div className="h-72 bg-gray-200 rounded-xl" />
            </div>
        </div>
    );
}
