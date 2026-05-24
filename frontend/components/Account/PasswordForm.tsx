"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";

interface FormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface FormErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
}

function validate(data: FormData): FormErrors {
    const errors: FormErrors = {};
    if (!data.currentPassword) errors.currentPassword = "Current password is required";
    if (!data.newPassword) {
        errors.newPassword = "New password is required";
    } else if (data.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters";
    }
    if (!data.confirmPassword) {
        errors.confirmPassword = "Please confirm your new password";
    } else if (data.newPassword !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }
    return errors;
}

export default function PasswordForm() {
    const [formData, setFormData] = useState<FormData>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
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
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
            await apiClient.patch("/api/v1/users/changePassword", {
                password: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmNewPassword: formData.confirmPassword,
            });
            setSuccessMessage("Password changed successfully!");
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setErrors({ general: error?.response?.data?.message ?? "Something went wrong." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 className="text-[#DB4444] font-medium text-xl mb-8">Change Password</h2>

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

            <div className="space-y-3 mb-8">
                <div>
                    <input type="password" name="currentPassword" value={formData.currentPassword}
                        onChange={handleChange} placeholder="Current Password"
                        className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.currentPassword ? "ring-2 ring-red-400" : ""}`} />
                    {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                </div>
                <div>
                    <input type="password" name="newPassword" value={formData.newPassword}
                        onChange={handleChange} placeholder="New Password"
                        className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.newPassword ? "ring-2 ring-red-400" : ""}`} />
                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                </div>
                <div>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword}
                        onChange={handleChange} placeholder="Confirm New Password"
                        className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.confirmPassword ? "ring-2 ring-red-400" : ""}`} />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
            </div>

            <div className="flex items-center justify-end gap-4">
                <button type="button" onClick={handleCancel}
                    className="text-sm text-gray-700 hover:text-gray-900 transition">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading}
                    className="px-8 py-3 bg-[#DB4444] text-white text-sm font-medium rounded hover:bg-[#c73c3c] transition disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px]">
                    {isLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}