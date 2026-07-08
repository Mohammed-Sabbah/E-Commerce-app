"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { Globe, ChevronDown, Check } from "lucide-react"

const locales = [
  { code: "en", labelKey: "english" },
  { code: "ar", labelKey: "arabic" },
] as const

export function LanguageSwitcher() {
  const t = useTranslations("nav")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMousedown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleMousedown)
    return () => document.removeEventListener("mousedown", handleMousedown)
  }, [])

  function select(newLocale: string) {
    router.push(pathname, { locale: newLocale })
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("selectLanguage")}
        className="flex items-center gap-1 text-xs sm:text-sm text-gray-300 hover:text-white transition cursor-pointer"
      >
        <Globe className="size-3.5 sm:size-4" />
        <span className="hidden sm:inline">{t(locales.find((l) => l.code === locale)!.labelKey)}</span>
        <ChevronDown
          className={`size-3.5 sm:size-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("selectLanguage")}
          className="absolute top-full mt-2 end-0 min-w-28 bg-white text-black rounded-md shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-1"
        >
          {locales.map((l) => {
            const active = l.code === locale
            return (
              <li
                key={l.code}
                role="option"
                aria-selected={active}
                onClick={() => select(l.code)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm cursor-pointer transition-colors ${
                  active
                    ? "bg-gray-100 text-black font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {active && <Check className="size-3.5 shrink-0" />}
                <span className={active ? "" : "ms-5"}>{t(l.labelKey)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
