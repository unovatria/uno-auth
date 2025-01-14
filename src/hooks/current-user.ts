import { auth } from "@/lib/auth/auth";

/**
 * SERVER! component'lerinde session bilgisini almak için kullanılacak olan hook
 */
export const currentUser = async () => {
  const session = await auth();
  return session?.user;
}