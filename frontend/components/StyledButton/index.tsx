import { cn } from '@/lib/utils'

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
            className={cn(`bg-[#DB4444] text-white px-12 py-4 rounded-[4px] disabled:bg-[#e88080]`, ClassName)}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    {loadingText ?? "Loading..."}
                </span>
            ) : (
                title
            )}
        </button>
    )
}

export default StyledButton