import PasswordForm from "@/components/Account/PasswordForm";
import PersonalInfoForm from "@/components/Account/PersonalInfoForm";
import { getMyProfile } from "@/services/server/userService";
import { getTranslations } from "next-intl/server";

export default async function AccountPage() {
    const t = await getTranslations("account");
    const profile = await getMyProfile();
    if (!profile) return null;

    return (
        <div className="space-y-10">
            <h1 className="text-[#DB4444] font-medium text-xl mb-6">{t("myAccount")}</h1>
            <PersonalInfoForm profile={profile} />
            <hr className="border-gray-200" />
            <PasswordForm />
        </div>
    );
}