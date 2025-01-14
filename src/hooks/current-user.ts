import { auth } from "@/lib/authlib/auth";

/**
 * SERVER! component'lerinde session bilgisini almak için kullanılacak olan hook
 */
export const currentUser = async () => {
  const session = await auth();
  return session?.user;
}