import Link from "next/link"
import Container from "../Container"
import SearchInput from "../SearchInput"
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';


function Header() {
    return (
        <header>
            <div className="header-banner bg-black">
                <Container className="relative flex justify-center items-center space-x-86 p-4 text-white">
                    <p className="text-center m-0">Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! <a className="underline" href="#">ShopNow</a></p>
                    <button className="absolute right-4 top-4">English</button>
                </Container>
            </div>
            <nav className="bg-white text-black pt-8">
                <Container className="flex items-center justify-between p-3">
                    <div className="logo text-2xl font-bold">Exclusive</div>
                    <ul className="flex space-x-8">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/">Contact</Link></li>
                        <li><Link href="/">About</Link></li>
                        <li><Link href="/">Sign Up</Link></li>
                    </ul>
                    <div className="flex space-x-5">
                        <SearchInput/>
                        <button className="relative">
                            <HeartIcon className="h-6 w-6" />
                        </button>
                        <button className="relative">
                            <ShoppingCartIcon className="h-6 w-6" />
                        </button>
                    </div>
                </Container>
            </nav>
        </header>
    )
}

export default Header