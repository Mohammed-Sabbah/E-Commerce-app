import Container from '../Container'
import Link from 'next/link'
import SearchInput from '../SearchInput'
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import UserMenu from "../UserMenu";
import HeaderHeartButton from './HeaderHeartButton';


function NavBar({token}:{token:string | undefined}) {
    return (
        <nav className="bg-white text-black pt-8">
            <Container className="flex items-center justify-between p-3">
                <div className="logo text-2xl font-bold">Exclusive</div>
                <ul className="flex space-x-8">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/">Contact</Link></li>
                    <li><Link href="/">About</Link></li>
                    <li><Link href="/">Sign Up</Link></li>
                </ul>
                <div className="flex gap-5">
                    <SearchInput />
                    <HeaderHeartButton/>
                    <button className="relative  text-center">
                        <ShoppingCartIcon className="h-6 w-6" />
                    </button>
                    {token && <UserMenu />}

                </div>
            </Container>
        </nav>
    )
}

export default NavBar