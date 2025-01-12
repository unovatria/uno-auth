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
import { DEFAULT_REGISTER_ADRESS } from "@/routes";

export const LoginForm = () => {

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : undefined;

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
      login(values)
        //bu kısım ile server side component içerisindeki error / success kısmını fronta getirip forma yansıtacağız:
        .then((data) => {
          setError(data?.error);
          // TODO Change when 2FA added.
          setSuccess(data?.success);
          // soru işaretleri arkadan gelen "NEXT_REDIRECT" hatasının ön tarafa yansımaması için.
        })
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button
            typeof="submit"
            className="w-full"
            disabled={isPending}
          >
            Login
          </Button>

        </form>
      </Form>
    </CardWrapper>
  );
};
