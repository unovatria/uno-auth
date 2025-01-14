"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_PASSWORD_RESET_ADRESS, DEFAULT_REGISTER_ADRESS } from "@/routes";
import Link from "next/link";

export const LoginForm = () => {

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : undefined;

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {

    setError("");
    setSuccess("");

    // bu kısımda server component çağırıyoruz.
    // benzeri: axios.post("/api/route", values)
    startTransition(() => {
      login(values, callbackUrl)
        //bu kısım ile server side component içerisindeki error / success kısmını fronta getirip forma yansıtacağız:
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data?.error);
          }
          if (data?.success) {
            form.reset();
            setSuccess(data?.success);
          }
          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
          // soru işaretleri arkadan gelen "NEXT_REDIRECT" hatasının ön tarafa yansımaması için.
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome"
      backButtonLabel="Don't have an account ?"
      backButtonHref={DEFAULT_REGISTER_ADRESS}
      showSocial={!isPending}
    >
      {/** Form (wrapping entire constant "form") **/}
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="twofactorcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField 
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="itsme@email.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="********"
                          type="password"
                        />
                      </FormControl>

                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href={DEFAULT_PASSWORD_RESET_ADRESS}>
                          Forgot password ?
                        </Link>
                      </Button>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button
            typeof="submit"
            className="w-full"
            disabled={isPending}
          >
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>

        </form>
      </Form>
    </CardWrapper>
  );
};
