import NextAuth, { type DefaultSession } from "next-auth";

// Todo //* look 3:15~~

export type ExtendedUser = DefaultSession["user"] & {
  username: string;
  isTwoFactorEnabled: boolean;
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