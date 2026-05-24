'use client'
import { useLogout } from '@/hooks/useLogout'
import LoadingSvg from '../LoadingSvg'

function LogoutButton({ children, className }: { children: React.ReactNode, className: string }) {
  const { mutate: logout, isPending } = useLogout()
  return (
    <button className={className} onClick={() => logout()} disabled={isPending}>
      {children}
      {isPending ? <LoadingSvg/> : ""}
    </button>
  )
}

export default LogoutButton