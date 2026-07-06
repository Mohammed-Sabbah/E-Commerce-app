import AddressForm from "@/components/Account/AddressForm";
import { getMyProfile } from "@/services/server/userService";

export default async function AddressPage() {
    const profile = await getMyProfile();
    if (!profile) return null;

    return <AddressForm profile={profile} />;
}