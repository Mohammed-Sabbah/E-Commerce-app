import Link from "next/link";

interface CartActionsProps {
    onUpdate: () => void;
}

export default function CartActions({ onUpdate }: CartActionsProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <Link
                href="/"
                className="border border-black rounded-md px-6 py-3 text-center hover:bg-black hover:text-white transition"
            >
                Return To Shop
            </Link>

            <button
                onClick={onUpdate}
                className="border border-black rounded-md px-6 py-3 hover:bg-black hover:text-white transition cursor-pointer"
            >
                Update Cart
            </button>
        </div>
    );
}