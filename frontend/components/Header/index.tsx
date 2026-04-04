import Container from "../Container"
import { cookies } from "next/headers";
import NavBar from "./NavBar";


async function Header() {
    const token = (await cookies()).get("token")?.value;

    return (
        <header className="border-b-[1.5px] border-gray-300">
            <div className="header-banner bg-black">
                <Container className="relative flex justify-center items-center space-x-86 p-4 text-white">
                    <p className="text-center m-0">Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! <a className="underline" href="#">ShopNow</a></p>
                    <button className="absolute right-4 top-4">English</button>
                </Container>
            </div>
            <NavBar token={token}/>
        </header>
    )
}

export default Header
