import Container from "../Container"
import { cookies } from "next/headers";
import NavBar from "./NavBar";

async function Header() {
    const token = (await cookies()).get("token")?.value;

    return (
        <header className="border-b border-gray-200 sticky top-0 z-50 bg-white">

            {/* Banner */}
            <div className="bg-black text-white">
                <Container className="relative flex items-center justify-center py-3 px-4">
                    <p className="text-xs sm:text-sm text-center">
                        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
                        <a href="#" className="underline font-semibold hover:text-gray-300 transition">
                            ShopNow
                        </a>
                    </p>
                    <button className="absolute right-4 text-xs sm:text-sm text-gray-300 hover:text-white transition hidden sm:block">
                        English ▾
                    </button>
                </Container>
            </div>

            {/* NavBar */}
            <NavBar token={token} />

        </header>
    );
}

export default Header;