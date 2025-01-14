//import { Header } from "@/components/auth/header";
//import { BackButton } from "@/components/auth/back-button";
//import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { DEFAULT_LOGIN_ADRESS } from "@/lib/routes";
import { CardWrapper } from "./card-wrapper";
import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorForm = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonLabel="Back to login"
      backButtonHref={DEFAULT_LOGIN_ADRESS}
    >
      <div className="w-full flex justify-center items-center">
        <FaExclamationTriangle className="text-destructive" />
      </div>
    </CardWrapper>

    /*
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="Oops! Something went wrong!" />
      </CardHeader>
      <CardFooter>
        <BackButton label="Back to login" href={DEFAULT_LOGIN_ADRESS} />
      </CardFooter>
    </Card>
    */
  );
};
