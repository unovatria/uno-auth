import { auth } from "@/auth";

/**
 * SERVER! component'lerinde session bilgisini almak için kullanılacak olan hook
 * @type {public method}
 */
export const currentUser = async () => {
  const session = await auth();
  return session?.user;
}