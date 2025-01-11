import NextAuth from "next-auth";

import authConfig from "./auth.config";

import {
  AuthApiPrefix,
  DEFAULT_LOGIN_REDIRECT,
  PublicRoutes,
  AuthRoutes,
} from "@/routes";
import { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);
 
export default auth((req) => {

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthApiRoute = nextUrl.pathname.startsWith(AuthApiPrefix);
  const isPublicRoute = PublicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = AuthRoutes.includes(nextUrl.pathname);

  if (isAuthApiRoute) return null;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // Require authentication for protected routes
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl))
  }

  return null
  
});
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}