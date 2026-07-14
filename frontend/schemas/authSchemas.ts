import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string()
        .min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email format"),
    phone: z.string()
        .optional(),
    password: z.string()
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
        .min(6, "confirmPassword must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match password",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string()
        .min(6, "Password must be at least 6 characters"),
});

export const forgetPasswordSchema = z.object({
    email: z.email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
    newPassword: z.string()
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
        .min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password does not match password",
    path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;