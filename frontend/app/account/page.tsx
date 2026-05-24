import PasswordForm from "@/components/Account/PasswordForm";
import PersonalInfoForm from "@/components/Account/PersonalInfoForm";
import { getMyProfile } from "@/services/server/userService";


export default async function AccountPage() {
    const profile = await getMyProfile();
    if (!profile) return null;

    return (
        <div className="space-y-10">
            <PersonalInfoForm profile={profile} />
            <hr className="border-gray-200" />
            <PasswordForm />
        </div>
    );
}