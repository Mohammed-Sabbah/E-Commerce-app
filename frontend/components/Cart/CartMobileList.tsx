import type { CartItem } from "@/types/cart";
import ProductMobileCard from "./ProductMobileCard";

interface CartMobileListProps {
    cartItems: CartItem[];
    onChange: (id: string, qty: number) => void;
    updates: Record<string, number>;
}

export default function CartMobileList({ cartItems, onChange, updates }: CartMobileListProps) {
    return (
        <div className="md:hidden space-y-4">
            {cartItems.map((item) => (
                <ProductMobileCard
                    key={item._id}
                    item={item}
                    onChange={onChange}
                    updates={updates}
                />
            ))}
        </div>
    );
}