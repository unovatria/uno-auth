"use server";

import { signOut } from "@/auth";
import { DEFAULT_LOGIN_ADRESS } from "@/routes";

export const logout = async () => {

  // optional: doing server stuff before logout.
  console.log("logout called");
  await signOut({ redirectTo: DEFAULT_LOGIN_ADRESS, });

};
