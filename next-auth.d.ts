import NextAuth, { type DefaultSession } from "next-auth";

//* look 3:15~~ (NOT)

export type ExtendedUser = DefaultSession["user"] & {
  username: string;
  twoFactorEnabled: boolean;
  isOAuth: boolean;
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  /*
  interface JWT {
    id: string
    username: string
  }
  */
}

/*
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
  }
}
*/