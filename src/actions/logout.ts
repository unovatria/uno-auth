"use server";

import { signOut } from "@/lib/authlib/auth";
import { DEFAULT_LOGIN_ADRESS } from "@/lib/routes";

export const logout = async () => {

  // optional: doing server stuff before logout.
  console.log("logout called");
  await signOut({ redirectTo: DEFAULT_LOGIN_ADRESS, });

};
