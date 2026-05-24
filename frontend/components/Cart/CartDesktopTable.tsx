import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { CartItem } from "@/types/cart";
import ProductRow from "./ProductRow";

interface CartDesktopTableProps {
    cartItems: CartItem[];
    onChange: (id: string, qty: number) => void;
    updates: Record<string, number>;
}

export default function CartDesktopTable({ cartItems, onChange, updates }: CartDesktopTableProps) {
    return (
        <div className="hidden md:block border rounded-xl overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Subtotal</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {cartItems.map((item) => (
                        <ProductRow
                            key={item._id}
                            cartItem={item}
                            onChange={onChange}
                            updates={updates}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}