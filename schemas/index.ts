import * as z from "zod";

export const LoginSchema = z.object({
  //email: z.string().email(),
  email: z.string().email({
    message: "Email is required!",
  }),
  //password: z.string().min(8),
  password: z.string().min(8, {
    message: "Password is required ! (Min 8 chars)",
  }),
  twofactorcode: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  //email: z.string().email(),
  email: z.string().email({
    message: "Invalid email adress!",
  }),
  //password: z.string().min(8),
  password: z.string().min(8, {
    message: "Minimum 8 characters required"
  }),
  username: z.string()
    .min(6, {
      message: "Username is required, (min 6 characters)"
    })
    .max(24, {
      message: "Username is required, (max24 characters)"
    })
    .toLowerCase()
    .regex(/^[a-z0-9_-]+$/, {
      message: "Username must be lowercase and can only contain letters, numbers, underscores, and dashes"
    }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required!",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password is required ! (Min 8 chars)",
  }),
});

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    username: z.optional(
      z.string()
        .min(6, {
          message: "Username is required, (min 6 characters)"
        })
        .max(24, {
          message: "Username is required, (max24 characters)"
        })
        .toLowerCase()
        .regex(/^[a-z0-9_-]+$/, {
          message: "Username must be lowercase and can only contain letters, numbers, underscores, and dashes"
        })
    ),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(8, {
      message: "Password is required ! (Min 8 chars)",
    })),
    newPassword: z.optional(z.string().min(8, {
      message: "Password is required ! (Min 8 chars)",
    })),
    twoFactorEnabled: z.optional(z.boolean()),
}).refine((data) =>  {
  if (data.password && !data.newPassword) return false;
  return true;
}, {
  message: "New password is required",
  path: ["newPassword"],
}).refine((data) =>  {
  if (data.newPassword && !data.password) return false;
  return true;
}, {
  message: "Password is required",
  path: ["password"],
});