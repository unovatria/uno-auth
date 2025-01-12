"use client";

import { DEFAULT_LOGIN_ADRESS } from "@/routes";
import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";

export const NewVerificationForm = () => {

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {

    if (success || error) return;

    if (!token) {
      setError("Missing Token!");
      return;
    }
    newVerification(token)

      .then((data) => {
        if (data.error) {
          setError(data.error);
        }
        if (data.success) {
          setSuccess(data.success);
        }
      })
      .catch(() => {
        setError("Something went wrong!");
      });

  }, [token, success, error])

  // ! useEffect ile çağrılan şeylerin console'a iki defa yansıması development'da olduğumuz için, production'da sadece 1 defa çağrılıyor.
  // ! in development react calls 'useEffect' twice.

  useEffect(() => {
    onSubmit();
  }, [onSubmit])

  return (
    <CardWrapper
      headerLabel="Confirming your email & account!"
      backButtonLabel="Back to login"
      backButtonHref={DEFAULT_LOGIN_ADRESS}
    >
      <div className="w-full flex justify-center items-center">
        {!success && !error && (
          <BeatLoader />
        )}
        <FormSuccess message={success} />
        {!success && (
          <FormError message={error} />
        )}
      </div>
    </CardWrapper>
  );
};
