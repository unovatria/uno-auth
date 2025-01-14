"use client";

import { DEFAULT_LOGIN_ADRESS } from "@/routes";
import { useRouter } from "next/navigation";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";

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
        <Dialog>
          <DialogTrigger asChild={asChild}>
            {children}
          </DialogTrigger>
          <DialogContent className="p-0 w-auto bg-transparent border-none">
            <LoginForm />
          </DialogContent>
        </Dialog>
      </span>
    );
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};