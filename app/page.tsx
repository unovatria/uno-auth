import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-400 to-zinc-800">
      <div className="space-y-6 text-center">
        <h1 className={cn(
          "text-6xl font-semibold text-white drop-shadow-md",
          font.className
          )}>
          Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">Next.js</span> Auth
        </h1>
        <p className="text-lg text-zinc-400">
          Authentication system build with Next.js and Tailwind CSS
        </p>
          <div>
            <LoginButton>
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </LoginButton>
          </div>
      </div>
    </main>
  );
}
