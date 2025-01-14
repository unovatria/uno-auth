import NextAuth from "next-auth";

import authConfig from "@/lib/auth/auth.config";

import {
  AuthApiPrefix,
  DEFAULT_AFTERLOGIN_REDIRECT,
  PublicRoutes,
  AuthRoutes,
  DEFAULT_LOGIN_ADRESS,
} from "@/lib/routes";

const { auth } = NextAuth(authConfig);
 
export default auth((req) =>  {

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthApiRoute = nextUrl.pathname.startsWith(AuthApiPrefix);
  const isPublicRoute = PublicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = AuthRoutes.includes(nextUrl.pathname);

  if (isAuthApiRoute) return undefined;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_AFTERLOGIN_REDIRECT, nextUrl));
    }
    return undefined;
  }

  // Require authentication for protected routes
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(
      `${DEFAULT_LOGIN_ADRESS}?callbackUrl=${encodedCallbackUrl}`, 
      nextUrl
    ));
  }

  return undefined;
  
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