"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import StyledButton from "@/components/StyledButton";
import AuthInput from "@/components/AuthInput/AuthInput";
import { useForgetPassword } from "@/hooks/useForgetPassword";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { forgetPasswordSchema, type ForgetPasswordSchema } from "@/schemas/authSchemas";

export default function ForgotPassword() {
    const t = useTranslations("auth");
    const { mutate, isPending, error } = useForgetPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgetPasswordSchema>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: { email: "" },
    });

    return (
        <form
            onSubmit={handleSubmit((data) => mutate(data))}
            className="w-full max-w-md px-4"
        >
            <h1 className="text-2xl md:text-4xl font-medium text-black">
                {t("forgotPasswordTitle")}
            </h1>

            <p className="mt-2 text-sm md:text-base text-black">
                {t("forgotPasswordSubtitle")}
            </p>

            <div className="mt-6 flex flex-col gap-5">
                <AuthInput
                    type="text"
                    placeholder={t("emailPlaceholder")}
                    autoComplete="username"
                    {...register("email")}
                    error={errors.email?.message}
                />

                {error && (
                    <p className="text-red-500 text-sm">
                        {error.response?.data?.message || t("somethingWentWrong")}
                    </p>
                )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <StyledButton
                    title={t("sendCode")}
                    isLoading={isPending}
                    loadingText={t("sending")}
                    type="submit"
                    ClassName="w-full"
                />

                <p className="text-center text-sm">
                    <Link href="/login" className="ms-2 font-semibold underline">
                        {t("backToLogin")}
                    </Link>
                </p>
            </div>
        </form>
    );
}
