"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { UserProfile } from "@/services/server/userService";

interface Address {
    alias: string;
    details: string;
    city: string;
    postalCode: string;
    phone: string;
}

interface FormErrors {
    details?: string;
    city?: string;
    general?: string;
}

function validate(data: Address): FormErrors {
    const errors: FormErrors = {};
    if (!data.city.trim()) errors.city = "City is required";
    if (!data.details.trim()) errors.details = "Address details are required";
    return errors;
}

export default function AddressForm({ profile }: { profile: UserProfile }) {
    const address = profile.addresses?.[0];

    const [formData, setFormData] = useState<Address>({
        alias: address?.alias ?? "Home",
        details: address?.details ?? "",
        city: address?.city ?? "",
        postalCode: address?.postalCode ?? "",
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
        setFormData({
            alias: address?.alias ?? "Home",
            details: address?.details ?? "",
            city: address?.city ?? "",
            postalCode: address?.postalCode ?? "",
            phone: profile.phone ?? "",
        });
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
            await apiClient.patch("/api/v1/users/updateMe", {
                addresses: [
                    {
                        alias: formData.alias.trim() || "Home",
                        details: formData.details.trim(),
                        city: formData.city.trim(),
                        postalCode: formData.postalCode.trim(),
                        phone: formData.phone.trim(),
                    },
                ],
            });
            setSuccessMessage("Address saved successfully!");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setErrors({ general: error?.response?.data?.message ?? "Something went wrong." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 className="text-[#DB4444] font-medium text-xl mb-8">Address Book</h2>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input type="text" name="alias" value={formData.alias} onChange={handleChange}
                        placeholder="e.g. Home, Work"
                        className="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                        placeholder="Phone number"
                        className="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange}
                        placeholder="City"
                        className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.city ? "ring-2 ring-red-400" : ""}`} />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange}
                        placeholder="Postal Code"
                        className="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition" />
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Details</label>
                <input type="text" name="details" value={formData.details} onChange={handleChange}
                    placeholder="Street, building, floor..."
                    className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.details ? "ring-2 ring-red-400" : ""}`} />
                {errors.details && <p className="text-red-500 text-xs mt-1">{errors.details}</p>}
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