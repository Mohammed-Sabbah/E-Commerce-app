import { getCategories } from "@/services/server/pruductService";
import { CollapsibleTreeClient } from "./CollapsibleTreeClient";

export default async function CollapsibleTree({ className }: { className?: string }) {
    const categoriesRes = await getCategories();
    const categories = categoriesRes?.data?.docs ?? [];

    return <CollapsibleTreeClient categories={categories} className={className} />;
}