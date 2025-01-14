import { useSession } from "next-auth/react"

/**
 * Client component'lerinde session bilgisini almak için kullanılacak olan hook
 */
export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
}