import { adminFetch } from "@/lib/adminFetch";
import type { AdminStats } from "@/types/admin";
import StatsCards from "@/components/Admin/adminDashboard/StatsCards";
import RevenueChart from "@/components/Admin/adminDashboard/RevenueChart";
import OrdersChart from "@/components/Admin/adminDashboard/OrdersChart";
import StatusPie from "@/components/Admin/adminDashboard/StatusPie";
import TopProducts from "@/components/Admin/adminDashboard/TopProducts";

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
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">Overview of your store</p>
            </div>

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
        </div>
    );
}
