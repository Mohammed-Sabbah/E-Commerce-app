import Container from "@/components/Container";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
    TruckIcon,
    PhoneIcon,
    ShieldCheckIcon,
    BuildingStorefrontIcon,
    CurrencyDollarIcon,
    ShoppingBagIcon,
    BanknotesIcon,
} from "@heroicons/react/24/outline";

// ==============================
// Data
// ==============================

const stats = [
    {
        icon: <BuildingStorefrontIcon className="w-5 h-5" />,
        value: "10.5k",
        label: "Sellers active our site",
    },
    {
        icon: <CurrencyDollarIcon className="w-5 h-5" />,
        value: "33k",
        label: "Monthly Product Sale",
        highlight: true,
    },
    {
        icon: <ShoppingBagIcon className="w-5 h-5" />,
        value: "45.5k",
        label: "Customer active in our site",
    },
    {
        icon: <BanknotesIcon className="w-5 h-5" />,
        value: "25k",
        label: "Annual gross sale in our site",
    },
];

const team = [
    {
        name: "Tom Cruise",
        role: "Founder & Chairman",
        img: "/images/088149fd5afc043392ee3cbb529f429b3e2098d3.png",
    },
    {
        name: "Emma Watson",
        role: "Managing Director",
        img: "/images/8438eab9a2fe88af0272adecd83422d0cb7e20d7.png",
    },
    {
        name: "Will Smith",
        role: "Product Designer",
        img: "/images/ede48f2b5df8103b281240ce5bafe5dd7d215ab8.png",
    },
];

const services = [
    {
        icon: <TruckIcon className="w-7 h-7" />,
        title: "FREE AND FAST DELIVERY",
        desc: "Free delivery for all orders over $140",
    },
    {
        icon: <PhoneIcon className="w-7 h-7" />,
        title: "24/7 CUSTOMER SERVICE",
        desc: "Friendly 24/7 customer support",
    },
    {
        icon: <ShieldCheckIcon className="w-7 h-7" />,
        title: "MONEY BACK GUARANTEE",
        desc: "We return money within 30 days",
    },
];

// ==============================
// Page
// ==============================

export default function AboutPage() {
    return (
        <main>
            <Container className="py-8 md:py-14 flex flex-col gap-20">

                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500">
                    <Link href="/" className="hover:underline">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-black font-medium">About</span>
                </nav>

                {/* ===== Our Story ===== */}
                <section className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    <div className="flex-1 order-2 lg:order-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h1>
                        <p className="text-gray-500 text-sm leading-7 mb-4">
                            Launched in 2015, Exclusive is South Asia`s premier online shopping marketplace
                            with an active presence in Bangladesh. Supported by a wide range of tailored
                            marketing, data and service solutions, Exclusive has 10,500 sellers and 300
                            brands and serves 3 millions customers across the region.
                        </p>
                        <p className="text-gray-500 text-sm leading-7">
                            Exclusive has more than 1 Million products to offer, growing at a very fast.
                            Exclusive offers a diverse assortment in categories ranging from consumer.
                        </p>
                    </div>

                    <div className="flex-1 order-1 lg:order-2 w-full">
                        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-pink-100">
                            <Image
                                src="/images/fcc89aaa7b85f8c1dcce81e71e2eb178be13bd4d.jpg"
                                alt="Our Story"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </section>

                {/* ===== Stats ===== */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`
                                border rounded p-5 md:p-7 flex flex-col items-center gap-2 text-center
                                transition-all duration-300 cursor-default
                                ${stat.highlight
                                    ? "bg-red-500 text-white border-red-500"
                                    : "border-gray-200 hover:bg-red-500 hover:text-white hover:border-red-500"
                                }
                            `}
                        >
                            {/* Icon with double circle */}
                            <div className="relative flex items-center justify-center mb-1">
                                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center ring-8 ring-gray-200">
                                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs md:text-sm leading-tight">{stat.label}</p>
                        </div>
                    ))}
                </section>

                {/* ===== Team ===== */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member) => (
                            <div key={member.name}>
                                {/* Photo */}
                                <div className="relative w-full h-64 md:h-72 bg-gray-100 rounded overflow-hidden mb-4">
                                    <Image
                                        src={member.img}
                                        alt={member.name}
                                        fill
                                        className="object-cover object-top"
                                    />
                                </div>

                                {/* Info */}
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <p className="text-gray-500 text-sm mb-2">{member.role}</p>

                                {/* Social Icons */}
                                <div className="flex items-center gap-3">
                                    <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-black transition">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                    <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-black transition">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-black transition">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== Services ===== */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    {services.map((service) => (
                        <div key={service.title} className="flex flex-col items-center gap-4">
                            {/* Icon with double circle */}
                            <div className="relative flex items-center justify-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center ring-8 ring-gray-200">
                                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white">
                                        {service.icon}
                                    </div>
                                </div>
                            </div>
                            <h4 className="font-bold text-sm tracking-wide">{service.title}</h4>
                            <p className="text-gray-500 text-sm">{service.desc}</p>
                        </div>
                    ))}
                </section>

            </Container>
        </main>
    );
}