import * as z from "zod";

export const LoginSchema = z.object({
  //email: z.string().email(),
  email: z.string().email({
    message: "Email is required!",
  }),
  //password: z.string().min(8),
  password: z.string().min(8, {
    message: "Password is required !",
  }),
});

export const RegisterSchema = z.object({
  //email: z.string().email(),
  email: z.string().email({
    message: "Invalid email adress!",
  }),
  //password: z.string().min(8),
  password: z.string().min(8, {
    message: "Password has to be at least 8 characters"
  }),
});