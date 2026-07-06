import OrdersTable from "@/components/Account/OrdersTable";
import { getMyOrders } from "@/services/server/orderService";
import { getTranslations } from "next-intl/server";

export default async function OrdersPage() {
    const t = await getTranslations("account");
    const orders = await getMyOrders();
    return (
        <div>
            <h1 className="text-[#DB4444] font-medium text-xl mb-6">{t("myOrders")}</h1>
            <OrdersTable orders={orders} />
        </div>
    );
}