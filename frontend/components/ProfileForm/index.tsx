// "use client";

// import { useState } from "react";
// import { apiClient } from "@/lib/apiClient";
// import { UserProfile } from "@/services/server/userService";

// interface ProfileFormProps {
//     profile: UserProfile;
// }

// interface FormData {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     alias: string;
//     details: string;
//     city: string;
//     postalCode: string;
//     currentPassword: string;
//     newPassword: string;
//     confirmPassword: string;
// }

// interface FormErrors {
//     firstName?: string;
//     lastName?: string;
//     email?: string;
//     phone?: string;
//     currentPassword?: string;
//     newPassword?: string;
//     confirmPassword?: string;
//     general?: string;
// }

// function splitName(fullName: string): { firstName: string; lastName: string } {
//     const parts = fullName.trim().split(" ");
//     const firstName = parts[0] ?? "";
//     const lastName = parts.slice(1).join(" ") ?? "";
//     return { firstName, lastName };
// }

// function validate(data: FormData): FormErrors {
//     const errors: FormErrors = {};

//     if (!data.firstName.trim()) errors.firstName = "First name is required";
//     if (!data.lastName.trim()) errors.lastName = "Last name is required";

//     if (!data.email.trim()) {
//         errors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
//         errors.email = "Invalid email address";
//     }

//     const isChangingPassword =
//         data.currentPassword || data.newPassword || data.confirmPassword;

//     if (isChangingPassword) {
//         if (!data.currentPassword)
//             errors.currentPassword = "Current password is required";

//         if (!data.newPassword) {
//             errors.newPassword = "New password is required";
//         } else if (data.newPassword.length < 8) {
//             errors.newPassword = "Password must be at least 8 characters";
//         }

//         if (!data.confirmPassword) {
//             errors.confirmPassword = "Please confirm your new password";
//         } else if (data.newPassword !== data.confirmPassword) {
//             errors.confirmPassword = "Passwords do not match";
//         }
//     }

//     return errors;
// }

// export default function ProfileForm({ profile }: ProfileFormProps) {
//     const { firstName, lastName } = splitName(profile.name);
//     const address = profile.addresses?.[0];

//     const [formData, setFormData] = useState<FormData>({
//         firstName,
//         lastName,
//         email: profile.email,
//         phone: profile.phone ?? "",
//         alias: address?.alias ?? "Home",
//         details: address?.details ?? "",
//         city: address?.city ?? "",
//         postalCode: address?.postalCode ?? "",
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     });

//     const [errors, setErrors] = useState<FormErrors>({});
//     const [isLoading, setIsLoading] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");

//     function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//         if (errors[name as keyof FormErrors]) {
//             setErrors((prev) => ({ ...prev, [name]: undefined }));
//         }
//     }

//     function handleCancel() {
//         setFormData({
//             firstName,
//             lastName,
//             email: profile.email,
//             phone: profile.phone ?? "",
//             alias: address?.alias ?? "Home",
//             details: address?.details ?? "",
//             city: address?.city ?? "",
//             postalCode: address?.postalCode ?? "",
//             currentPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//         });
//         setErrors({});
//         setSuccessMessage("");
//     }

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         setSuccessMessage("");

//         const validationErrors = validate(formData);
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return;
//         }

//         setIsLoading(true);

//         try {
//             // 1. تحديث البيانات الشخصية
//             const emailChanged = formData.email.trim() !== profile.email.trim();

//             await apiClient.patch("/api/v1/users/updateMe", {
//                 name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
//                 ...(emailChanged && { email: formData.email.trim() }),
//                 phone: formData.phone.trim(),
//                 addresses: [
//                     {
//                         alias: formData.alias.trim() || "Home",
//                         details: formData.details.trim(),
//                         phone: formData.phone.trim(),
//                         city: formData.city.trim(),
//                         postalCode: formData.postalCode.trim(),
//                     },
//                 ],
//             });

//             // 2. تغيير الباسورد — endpoint منفصل
//             const isChangingPassword =
//                 formData.currentPassword ||
//                 formData.newPassword ||
//                 formData.confirmPassword;

//             if (isChangingPassword) {
//                 await apiClient.patch("/api/v1/users/changePassword", {
//                     password: formData.currentPassword,
//                     newPassword: formData.newPassword,
//                     confirmNewPassword: formData.confirmPassword,
//                 });
//             }

//             setSuccessMessage("Profile updated successfully!");
//             setFormData((prev) => ({
//                 ...prev,
//                 currentPassword: "",
//                 newPassword: "",
//                 confirmPassword: "",
//             }));
//         } catch (err: unknown) {
//             const error = err as { response?: { data?: { message?: string } } };
//             const message =
//                 error?.response?.data?.message ?? "Something went wrong. Try again.";
//             setErrors({ general: message });
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     return (
//         <form onSubmit={handleSubmit} noValidate>
//             {/* Section Title */}
//             <h2 className="text-[#DB4444] font-medium text-xl mb-8">
//                 Edit Your Profile
//             </h2>

//             {/* General Error */}
//             {errors.general && (
//                 <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
//                     {errors.general}
//                 </div>
//             )}

//             {/* Success Message */}
//             {successMessage && (
//                 <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
//                     {successMessage}
//                 </div>
//             )}

//             {/* Name Row */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         First Name
//                     </label>
//                     <input
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         placeholder="First Name"
//                         className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.firstName ? "ring-2 ring-red-400" : ""}`}
//                     />
//                     {errors.firstName && (
//                         <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Last Name
//                     </label>
//                     <input
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         placeholder="Last Name"
//                         className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.lastName ? "ring-2 ring-red-400" : ""}`}
//                     />
//                     {errors.lastName && (
//                         <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
//                     )}
//                 </div>
//             </div>

//             {/* Email & Phone Row */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Email
//                     </label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="Email"
//                         className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.email ? "ring-2 ring-red-400" : ""}`}
//                     />
//                     {errors.email && (
//                         <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Phone
//                     </label>
//                     <input
//                         type="text"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         placeholder="Phone number"
//                         className="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition"
//                     />
//                 </div>
//             </div>

//             {/* Address Section */}
//             <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Address
//                 </label>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                         <input
//                             type="text"
//                             name="alias"
//                             value={formData.alias}
//                             onChange={handleChange}
//                             placeholder="Label (e.g. Home, Work)"
//                             className="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition"
//                         />
//                     </div>

//                     <div>
//                         <input
//                             type="text"
//                             name="city"
//                             value={formData.city}
//                             onChange={handleChange}
//                             placeholder="City"
//                             className="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition"
//                         />
//                     </div>

//                     <div>
//                         <input
//                             type="text"
//                             name="postalCode"
//                             value={formData.postalCode}
//                             onChange={handleChange}
//                             placeholder="Postal Code"
//                             className="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition"
//                         />
//                     </div>

//                     <div>
//                         <input
//                             type="text"
//                             name="details"
//                             value={formData.details}
//                             onChange={handleChange}
//                             placeholder="Address details"
//                             className="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Password Section */}
//             <div className="mb-8">
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Password Changes
//                 </label>

//                 <div className="space-y-3">
//                     <div>
//                         <input
//                             type="password"
//                             name="currentPassword"
//                             value={formData.currentPassword}
//                             onChange={handleChange}
//                             placeholder="Current Password"
//                             className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.currentPassword ? "ring-2 ring-red-400" : ""}`}
//                         />
//                         {errors.currentPassword && (
//                             <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
//                         )}
//                     </div>

//                     <div>
//                         <input
//                             type="password"
//                             name="newPassword"
//                             value={formData.newPassword}
//                             onChange={handleChange}
//                             placeholder="New Password"
//                             className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.newPassword ? "ring-2 ring-red-400" : ""}`}
//                         />
//                         {errors.newPassword && (
//                             <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
//                         )}
//                     </div>

//                     <div>
//                         <input
//                             type="password"
//                             name="confirmPassword"
//                             value={formData.confirmPassword}
//                             onChange={handleChange}
//                             placeholder="Confirm New Password"
//                             className={`w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm outline-none focus:ring-2 focus:ring-[#DB4444] transition ${errors.confirmPassword ? "ring-2 ring-red-400" : ""}`}
//                         />
//                         {errors.confirmPassword && (
//                             <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Actions */}
//             <div className="flex items-center justify-end gap-4">
//                 <button
//                     type="button"
//                     onClick={handleCancel}
//                     className="text-sm text-gray-700 hover:text-gray-900 transition"
//                 >
//                     Cancel
//                 </button>
//                 <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="px-8 py-3 bg-[#DB4444] text-white text-sm font-medium rounded hover:bg-[#c73c3c] transition disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px]"
//                 >
//                     {isLoading ? "Saving..." : "Save Changes"}
//                 </button>
//             </div>
//         </form>
//     );
// }