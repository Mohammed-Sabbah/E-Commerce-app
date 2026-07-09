import AddressForm from "@/components/Account/AddressForm";
import { getMyProfile } from "@/services/server/userService";
import { getTranslations } from "next-intl/server";

export default async function AddressPage() {
    const t = await getTranslations("account");
    const profile = await getMyProfile();
    if (!profile) return null;

    return (
        <div>
            <h1 className="text-[#DB4444] font-medium text-xl mb-6">{t("myAddresses")}</h1>
            <AddressForm profile={profile} />
        </div>
    );
}