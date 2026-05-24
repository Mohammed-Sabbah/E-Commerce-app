"use client";

import { useState } from "react";
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

function validate(data: FormData): FormErrors {
    const errors: FormErrors = {};
    if (!data.firstName.trim()) errors.firstName = "First name is required";
    if (!data.lastName.trim()) errors.lastName = "Last name is required";
    if (!data.email.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Invalid email address";
    }
    return errors;
}

export default function PersonalInfoForm({ profile }: Props) {
    const { firstName, lastName } = splitName(profile.name);

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
            setSuccessMessage("Profile updated successfully!");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setErrors({ general: error?.response?.data?.message ?? "Something went wrong." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 className="text-[#DB4444] font-medium text-xl mb-8">Edit Your Profile</h2>

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                        placeholder="First Name"
                        className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.firstName ? "ring-2 ring-red-400" : ""}`} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                        placeholder="Last Name"
                        className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.lastName ? "ring-2 ring-red-400" : ""}`} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                        placeholder="Email"
                        className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.email ? "ring-2 ring-red-400" : ""}`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                        placeholder="Phone number"
                        className="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition" />
                </div>
            </div>

            {/* Actions */}
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