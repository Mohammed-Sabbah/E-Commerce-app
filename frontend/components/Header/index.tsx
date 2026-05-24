import { cookies } from "next/headers";
import NavBar from "./NavBar";
import CollapsibleTree from "../CollapsibleTree/CollapsibleTreeServer";
import { Banner } from "./Bannar";

async function Header() {
    const token = (await cookies()).get("token")?.value;

    return (
        <header className="border-b border-gray-200 sticky top-0 z-50 bg-white">
            <Banner />
            <NavBar token={token} categoriesSlot={<CollapsibleTree />} />
        </header>
    );
}

export default Header;