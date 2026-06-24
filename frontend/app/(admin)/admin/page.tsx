import { adminFetch } from "@/lib/adminFetch";
import type { AdminStats } from "@/types/admin";
import { STATUS_STYLES } from "@/constants/orders";
import StatsCards from "@/components/Admin/adminDashboard/StatsCards";
import RevenueChart from "@/components/Admin/adminDashboard/RevenueChart";
import OrdersChart from "@/components/Admin/adminDashboard/OrdersChart";
import StatusPie from "@/components/Admin/adminDashboard/StatusPie";
import TopProducts from "@/components/Admin/adminDashboard/TopProducts";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";

export default async function AdminDashboardPage() {
    const { data, error } = await adminFetch<AdminStats>("/api/v1/admin/stats");

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Dashboard" subtitle="Overview of your store" />

            <StatsCards
                totalOrders={data.totalOrders}
                totalRevenue={data.totalRevenue}
                totalUsers={data.totalUsers}
                totalProducts={data.totalProducts}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={data.monthlyRevenue.filter((d) => d.revenue != null) as { _id: string; revenue: number }[]} />
                <OrdersChart data={data.monthlyOrders.filter((d) => d.count != null) as { _id: string; count: number }[]} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusPie data={data.ordersByStatus} />
                <TopProducts data={data.topProducts} />
            </div>

            {data.recentOrders && data.recentOrders.length > 0 && (
                <div>
                    <h2 className="text-base font-semibold text-gray-900 mb-3">Recent Orders</h2>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-left text-gray-500">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Order</th>
                                    <th className="px-4 py-3 font-medium">Customer</th>
                                    <th className="px-4 py-3 font-medium">Total</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900">
                                            {order.user?.name ?? "Unknown"}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            ${order.totalOrderPrice?.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                month: "short", day: "numeric", year: "numeric"
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
