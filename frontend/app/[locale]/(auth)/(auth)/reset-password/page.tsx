"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import StyledButton from "@/components/StyledButton";
import AuthInput from "@/components/AuthInput/AuthInput";
import { useVerifyResetCode } from "@/hooks/useVerifyResetCode";
import { useResetPassword } from "@/hooks/useResetPassword";
import { useTranslations } from "next-intl";

export default function ResetPassword() {
    const t = useTranslations("auth");
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [step, setStep] = useState<"code" | "password">("code");
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const verifyMutation = useVerifyResetCode();
    const resetMutation = useResetPassword();

    // Cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleCodeChange = useCallback((index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }, [code]);

    const handleCodeKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }, [code]);

    const handleCodePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;
        const newCode = pasted.split("").concat(Array(6 - pasted.length).fill(""));
        setCode(newCode);
        const focusIndex = Math.min(pasted.length, 5);
        inputRefs.current[focusIndex]?.focus();
    }, []);

    const handleVerifyCode = () => {
        const codeStr = code.join("");
        if (codeStr.length !== 6) return;
        verifyMutation.mutate(
            { resetCode: codeStr },
            { onSuccess: () => setStep("password") }
        );
    };

    const handleResetPassword = () => {
        setPasswordError("");
        if (newPassword.length < 6) {
            setPasswordError(t("passwordMin"));
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError(t("passwordsMustMatch"));
            return;
        }
        resetMutation.mutate({ email, newPassword, confirmNewPassword: confirmPassword });
    };

    const codeStr = code.join("");
    const isCodeComplete = codeStr.length === 6;

    return (
        <div className="w-full max-w-md px-4">
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-6">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${step === "code" ? "bg-[#DB4444] text-white" : "bg-green-500 text-white"}`}>
                    {step === "password" ? "✓" : "1"}
                </div>
                <div className={`h-px flex-1 transition-colors ${step === "password" ? "bg-green-500" : "bg-gray-300"}`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${step === "password" ? "bg-[#DB4444] text-white" : "bg-gray-200 text-gray-500"}`}>
                    2
                </div>
            </div>

            {step === "code" ? (
                <>
                    <h1 className="text-2xl md:text-4xl font-medium text-black">
                        {t("verifyCodeTitle")}
                    </h1>

                    <p className="mt-2 text-sm md:text-base text-black">
                        {t("verifyCodeSubtitle")}
                    </p>

                    {email && (
                        <p className="mt-1 text-sm text-gray-500">
                            {email}
                            <Link href="/forgot-password" className="ms-2 text-[#e14343] underline">
                                {t("wrongEmail")}
                            </Link>
                        </p>
                    )}

                    {/* OTP Input */}
                    <div className="mt-6 flex gap-3 justify-center" onPaste={handleCodePaste}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg focus:border-[#DB4444] focus:ring-1 focus:ring-[#DB4444] outline-none transition-colors"
                            />
                        ))}
                    </div>

                    {verifyMutation.error && (
                        <p className="mt-3 text-red-500 text-sm text-center">
                            {verifyMutation.error.response?.data?.message || t("invalidCode")}
                        </p>
                    )}

                    <div className="mt-6 flex flex-col gap-3">
                        <StyledButton
                            title={t("verifyCode")}
                            isLoading={verifyMutation.isPending}
                            loadingText={t("verifying")}
                            onClick={handleVerifyCode}
                            ClassName="w-full"
                        />

                        <button
                            type="button"
                            disabled={cooldown > 0}
                            onClick={() => {
                                if (email) {
                                    import("@/services/authService").then(({ forgetPassword }) => {
                                        forgetPassword({ email }).then(() => {
                                            setCooldown(60);
                                        });
                                    });
                                }
                            }}
                            className="text-sm text-[#e14343] hover:text-[#c92f2f] underline disabled:opacity-50 disabled:cursor-not-allowed text-center"
                        >
                            {cooldown > 0 ? t("resendIn", { seconds: cooldown }) : t("resendCode")}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h1 className="text-2xl md:text-4xl font-medium text-black">
                        {t("resetPasswordTitle")}
                    </h1>

                    <p className="mt-2 text-sm md:text-base text-black">
                        {t("resetPasswordSubtitle")}
                    </p>

                    <div className="mt-6 flex flex-col gap-5">
                        <div className="relative">
                            <AuthInput
                                type={showPassword ? "text" : "password"}
                                placeholder={t("newPasswordPlaceholder")}
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <AuthInput
                            type={showPassword ? "text" : "password"}
                            placeholder={t("confirmPasswordPlaceholder")}
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        />

                        {passwordError && (
                            <p className="text-red-500 text-sm">{passwordError}</p>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <StyledButton
                            title={t("resetPassword")}
                            isLoading={resetMutation.isPending}
                            loadingText={t("resetting")}
                            onClick={handleResetPassword}
                            ClassName="w-full"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
