'use client'
import { useLogout } from '@/hooks/useLogout'

function LogoutButton() {
  const { mutate: logout, isPending } = useLogout()
  return (
    <button onClick={() => logout()} disabled={isPending}>
      {isPending ? "Logging out..." : "Logout"}
    </button>
  )
}

export default LogoutButton