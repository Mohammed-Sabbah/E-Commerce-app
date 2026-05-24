import OrdersTable from "@/components/Account/OrdersTable";
import { getMyOrders } from "@/services/server/orderService";

export default async function OrdersPage() {
    const orders = await getMyOrders();
    return <OrdersTable orders={orders} />;
}