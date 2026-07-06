"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import StyledButton from "@/components/StyledButton";
import AuthInput from "@/components/AuthInput/AuthInput";
import { useRegister } from "@/hooks/useRegister";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { registerSchema, type RegisterSchema } from "@/schemas/authSchemas";

export default function Register() {
    const t = useTranslations("auth");
    const { mutate: registerUser, isPending, error } = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: RegisterSchema) => {
        const { confirmPassword, ...rest } = data;
        registerUser({ ...rest, confirmPassword: confirmPassword });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md px-4"
        >
            <h1 className="text-2xl md:text-4xl font-medium text-black">
                {t("registerTitle")}
            </h1>

            <p className="mt-2 text-sm md:text-base text-black">
                {t("registerSubtitle")}
            </p>

            <div className="mt-6 flex flex-col gap-5">
                <AuthInput
                    type="text"
                    placeholder={t("namePlaceholder")}
                    autoComplete="name"
                    {...register("name")}
                    error={errors.name?.message}
                />

                <AuthInput
                    type="text"
                    placeholder={t("emailOrPhonePlaceholder")}
                    autoComplete="username"
                    {...register("email")}
                    error={errors.email?.message}
                />

                <AuthInput
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    autoComplete="new-password"
                    {...register("password")}
                    error={errors.password?.message}
                />

                <AuthInput
                    type="password"
                    placeholder={t("confirmPasswordPlaceholder")}
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />

                {error && (
                    <p className="text-red-500 text-sm">
                        {error.response?.data?.message || t("registerFailed")}
                    </p>
                )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <StyledButton
                    title={t("createAccount")}
                    isLoading={isPending}
                    loadingText={t("creating")}
                    type="submit"
                    ClassName="w-full"
                />

                <StyledButton
                    title={t("signUpWithGoogle")}
                    type="button"
                    ClassName="w-full border border-black bg-transparent text-black"
                />

                <p className="text-center text-sm">
                    {t("alreadyHaveAccount")}
                    <Link href="/login" className="ml-2 font-semibold underline">
                        {t("loginLink")}
                    </Link>
                </p>
            </div>
        </form>
    );
}
