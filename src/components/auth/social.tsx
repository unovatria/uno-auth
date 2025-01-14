"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

import { signIn } from "next-auth/react";
import { DEFAULT_AFTERLOGIN_REDIRECT } from "@/lib/routes";
import { useSearchParams } from "next/navigation";

import type { LiteralUnion, SignInOptions } from "next-auth/react";
import type { BuiltInProviderType } from "next-auth/providers";

export const Social = () => {

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: LiteralUnion<BuiltInProviderType>) => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_AFTERLOGIN_REDIRECT,
    } as SignInOptions);
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5"/>
      </Button>

      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-5 w-5"/>
      </Button>
    </div>
  );
};