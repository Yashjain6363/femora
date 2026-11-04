import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .max(80, "Name is too long")
      .transform((s) => s.trim() || undefined),
    email: z.string().email("Enter a valid email").max(254).toLowerCase(),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(72, "Password is too long"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const loginPasswordSchema = z.object({
  email: z.string().email("Enter a valid email").max(254).toLowerCase(),
  password: z.string().min(1, "Enter your password"),
});

export type LoginPasswordValues = z.infer<typeof loginPasswordSchema>;

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254).toLowerCase(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
  website: z.string().max(0, "Bot detected").optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;