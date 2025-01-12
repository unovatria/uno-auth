"use client";

import { DEFAULT_LOGIN_ADRESS } from "@/routes";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {

  const router = useRouter();

  const onClick = () => {
    router.push(DEFAULT_LOGIN_ADRESS);
  };

  if (mode === "modal") {
    return (
      <span onClick={onClick} className="cursor-pointer">
        // TODO Implement modal
      </span>
    );
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};