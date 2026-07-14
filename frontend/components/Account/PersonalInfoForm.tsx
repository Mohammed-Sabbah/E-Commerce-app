"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { apiClient } from "@/lib/apiClient";
import { UserProfile } from "@/services/server/userService";

interface Props {
    profile: UserProfile;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    general?: string;
}

function splitName(fullName: string) {
    const parts = fullName.trim().split(" ");
    return {
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" ") ?? "",
    };
}

export default function PersonalInfoForm({ profile }: Props) {
    const t = useTranslations('account');
    const { firstName, lastName } = splitName(profile.name);

    function validate(data: FormData): FormErrors {
        const errors: FormErrors = {};
        if (!data.firstName.trim()) errors.firstName = t('firstNameRequired');
        if (!data.lastName.trim()) errors.lastName = t('lastNameRequired');
        if (!data.email.trim()) {
            errors.email = t('emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = t('invalidEmail');
        }
        return errors;
    }

    const [formData, setFormData] = useState<FormData>({
        firstName,
        lastName,
        email: profile.email,
        phone: profile.phone ?? "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    }

    function handleCancel() {
        setFormData({ firstName, lastName, email: profile.email, phone: profile.phone ?? "" });
        setErrors({});
        setSuccessMessage("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSuccessMessage("");

        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            const emailChanged = formData.email.trim() !== profile.email.trim();
            await apiClient.patch("/api/v1/users/updateMe", {
                name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
                ...(emailChanged && { email: formData.email.trim() }),
                phone: formData.phone.trim(),
            });
            setSuccessMessage(t('profileUpdated'));
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setErrors({ general: error?.response?.data?.message ?? t('somethingWentWrong') });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 className="text-[#DB4444] font-medium text-xl mb-8">{t('editYourProfile')}</h2>

            {errors.general && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                    {errors.general}
                </div>
            )}
            {successMessage && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
                    {successMessage}
                </div>
            )}

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('firstName')}</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                        placeholder={t('firstName')}
                        className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.firstName ? "ring-2 ring-red-400" : ""}`} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('lastName')}</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                        placeholder={t('lastName')}
                        className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.lastName ? "ring-2 ring-red-400" : ""}`} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                        placeholder={t('email')}
                        className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.email ? "ring-2 ring-red-400" : ""}`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                        placeholder={t('phone')}
                        className="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition" />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
                <button type="button" onClick={handleCancel}
                    className="text-sm text-gray-700 hover:text-gray-900 transition">
                    {t('cancel')}
                </button>
                <button type="submit" disabled={isLoading}
                    className="px-8 py-3 bg-[#DB4444] text-white text-sm font-medium rounded hover:bg-[#c73c3c] transition disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px]">
                    {isLoading ? t('saving') : t('saveChanges')}
                </button>
            </div>
        </form>
    );
}