import Image from 'next/image'
import StyledButton from '../StyledButton'

function CatigoryHero() {
    return (
        <div className="px-14 py-17 bg-black flex justify-between items-center">

            <div className="w-2/5 flex flex-col space-y-8">
                <h3 className="text-[1rem] text-[#00FF66] font-semibold ">Categories</h3>
                <p className="text-5xl text-[#FAFAFA] font-semibold tracking-[4%]">Enhance Your Music Experience</p>
                <StyledButton title="Buy Now" ClassName="hero-button self-start bg-[#00FF66] py-4 px-12 text-white inline-block" />
            </div>

            <div className="relative w-3/5 h-[330px] overflow-visible">
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-[120px]" />
                <Image
                    src="/images/3cc943ca7e210f637fc0504b7d93cd207df744c2.png"
                    alt="Hero Image"
                    fill
                    className="relative z-10 scale-x-[-1] object-cover"
                    sizes="(min-width: 768px) 60vw, 100vw"
                />
            </div>
        </div>
    )
}

export default CatigoryHero