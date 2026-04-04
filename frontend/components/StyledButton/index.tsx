import { cn } from '@/lib/utils'
import LoadingSvg from '../LoadingSvg'

function StyledButton({
    title,
    ClassName,
    type,
    isLoading,
    loadingText,
}: {
    title: string
    ClassName?: string
    type?: "button" | "reset" | "submit"
    isLoading?: boolean
    loadingText?: string
}) {
    return (
        <button
            type={type}
            disabled={isLoading}
            className={cn(`bg-[#DB4444] text-white px-12 py-4 rounded-lg disabled:bg-[#e88080]`, ClassName)}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <LoadingSvg />
                    {loadingText ?? "Loading..."}
                </span>
            ) : (
                title
            )}
        </button>
    )
}

export default StyledButton