"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/actions/register";
import { useState, useTransition } from "react";
import { DEFAULT_LOGIN_ADRESS } from "@/routes";

export const RegisterForm = () => {

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {

    setError("");
    setSuccess("");

    // bu kısımda server component çağırıyoruz.
    // benzeri: axios.post("/api/route", values)
    startTransition(() => {
      register(values)
        //bu kısım ile server side component içerisindeki error / success kısmını fronta getirip forma yansıtacağız:
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        })
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already an account ?"
      backButtonHref={DEFAULT_LOGIN_ADRESS}
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="username"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            typeof="submit"
            className="w-full"
            disabled={isPending}
          >
            Register
          </Button>

        </form>
      </Form>
    </CardWrapper>
  );
};
