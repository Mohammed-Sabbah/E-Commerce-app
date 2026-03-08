import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] }

export function CollapsibleTree({ ClassName }: { ClassName?: string }) {
    const fileTree: FileTreeItem[] = [
        {
            name: "Woman's Fashion",
            items: [
                {
                    name: "T-shirts",
                    items: [
                        { name: "button.tsx" },
                        { name: "card.tsx" },
                    ],
                },
                { name: "login-form.tsx" },
                { name: "register-form.tsx" },
            ],
        },
        {
            name: "Men's Fashion",
            items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],
        },
        {
            name: "Electronics",
            items: [
                { name: "use-media-query.ts" },
                { name: "use-debounce.ts" },
                { name: "use-local-storage.ts" },
            ],
        },
        {
            name: "Home & Lifestyle",
        },
        {
            name: "Medicine",
        },
        { name: "Sports & Outdoor" },
        { name: "Baby's & Toys" },
        { name: "Groceries & Pets" },
        { name: "Health & Beauty" },
    ]

    const renderItem = (fileItem: FileTreeItem) => {
        if ("items" in fileItem) {
            return (
                <Collapsible key={fileItem.name}>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="relative group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
                        >
                            {fileItem.name}
                            <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90 absolute right-2 top-1/2 transform -translate-y-1/2" />

                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 ml-5 style-lyra:ml-4">
                        <div className="flex flex-col gap-1">
                            {fileItem.items.map((child) => renderItem(child))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )
        }
        return (
            <Button
                key={fileItem.name}
                variant="link"
                size="sm"
                className="w-full justify-start gap-2 text-foreground"
            >
                <span>{fileItem.name}</span>
            </Button>
        )
    }

    return (

        <div className={`flex flex-col gap-1 ${ClassName}`}>
            {fileTree.map((item) => renderItem(item))}
        </div>
    )
}
