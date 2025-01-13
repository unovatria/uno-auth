import { SessionProvider } from "next-auth/react";
import { Navbar } from "./_components/navbar";
import { auth } from "@/auth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

//gn* kullanım ile ilgili not:
// Bu layout altında bulunan page.tsx içerisinde session bilgisini çekip kullunabiliyoruz.
// Bu fonksiyonu async yapmadan ve "<SessionProvider>" içerisine session bilgisi eklemedende çalıştırabiliyoruz.


const ProtectedLayout = async ({children}: ProtectedLayoutProps) => {
  
  const session = await auth();

  return ( 
    <SessionProvider session={session}>
      <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-zinc-400">
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  );
}

export default ProtectedLayout;