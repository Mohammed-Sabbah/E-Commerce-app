"use client";

import React from "react";
import StyledButton from "@/components/StyledButton";
import AuthInput from "@/components/AuthInput/AuthInput";
import { useLogin } from "@/hooks/useLogin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/schemas/authSchemas";

export default function Login() {
    const { mutate, isPending, error } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    return (
        <form
            onSubmit={handleSubmit((data) => mutate(data))}
            className="w-full max-w-md px-4"
        >
            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-medium text-black">
                Log in to Exclusive
            </h1>

            <p className="mt-2 text-sm md:text-base text-black">
                Enter your details below
            </p>

            {/* Inputs */}
            <div className="mt-6 flex flex-col gap-5">
                <AuthInput
                    type="text"
                    placeholder="Email"
                    autoComplete="username"
                    {...register("email")}
                    error={errors.email?.message}
                />

                <AuthInput
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    {...register("password")}
                    error={errors.password?.message}
                />

                {error && (
                    <p className="text-red-500 text-sm">
                        {error.response?.data?.message || "Login failed"}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <StyledButton
                    title="Log In"
                    isLoading={isPending}
                    loadingText="Logging in..."
                    type="submit"
                    ClassName="w-full sm:w-auto"
                />

                <a
                    href="#"
                    className="text-xs font-semibold text-[#e14343] hover:text-[#c92f2f] text-center sm:text-left"
                >
                    Forget Password?
                </a>
            </div>
        </form>
    );
}