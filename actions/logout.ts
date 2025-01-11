"use server";

import { signOut } from "@/auth";
import { DEFAULT_LOGIN_ADRESS } from "@/routes";

export const logout = async () => {

  console.log("logout called");
  await signOut({ redirectTo: DEFAULT_LOGIN_ADRESS, });

};
