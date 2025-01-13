"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { newPassword } from "@/actions/new-password";
import { useState, useTransition } from "react";
import { DEFAULT_LOGIN_ADRESS } from "@/routes";
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ""
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {

    setError("");
    setSuccess("");

    // bu kısımda server component çağırıyoruz.
    // benzeri: axios.post("/api/route", values)
    startTransition(() => {
      newPassword(values, token)
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
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref={DEFAULT_LOGIN_ADRESS}
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

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            typeof="submit"
            className="w-full"
            disabled={isPending}
          >
            Reset password
          </Button>

        </form>
      </Form>
    </CardWrapper>
  );
};