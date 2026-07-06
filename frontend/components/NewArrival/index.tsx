import { getTranslations } from 'next-intl/server';
import Image from "next/image";
import { Link } from "@/i18n/navigation";

function CardOverlay() {
  return <div className="absolute inset-0 bg-black/5" />;
}

async function CardContent({ title, description }: { title: string; description: string }) {
  const t = await getTranslations('nav');
  return (
    <div className="absolute bottom-6 start-6 max-w-xs">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-200">{description}</p>
      <Link href={"/"} className="mt-3 text-sm font-semibold underline underline-offset-4">
        {t('shopNow')}
      </Link>
    </div>
  );
}

async function CardContentSmall({ title, description }: { title: string; description: string }) {
  const t = await getTranslations('nav');
  return (
    <div className="absolute bottom-5 start-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-gray-200">{description}</p>
      <Link href={"/"} className="mt-2 text-xs font-semibold underline underline-offset-4">
        {t('shopNow')}
      </Link>
    </div>
  );
}

async function NewArrival() {
  const t = await getTranslations('products');
  return (
    <div className="grid gap-7.5 lg:grid-cols-2 lg:h-[560px]">

      <div className="relative overflow-hidden rounded-[4px] bg-black text-white h-[300px] lg:h-full">
        <Image
          src="/images/1c360f790c1817d3afa266b3c9f8c81ff0ed4428.png"
          alt={t('playstation5')}
          fill
          className="object-cover object-right"
          priority
        />
        <CardOverlay />
        <CardContent
          title={t('playstation5')}
          description={t('ps5Description')}
        />
      </div>

      <div className="grid gap-7.5 grid-rows-[1fr_auto]">

        <div className="relative overflow-hidden rounded-[4px] bg-black text-white h-[300px] lg:h-auto">
          <Image
            src="/images/455c8d6408463f7e8f57dd3048a2444dbfa0cb90.jpg"
            alt={t('womensCollections')}
            fill
            className="object-cover scale-x-[-1]"
          />
          <CardOverlay />
          <CardContent
            title={t('womensCollections')}
            description={t('womensCollectionsDesc')}
          />
        </div>

        <div className="grid grid-cols-2 gap-7.5 h-[200px] lg:h-[220px]">

          <div className="relative overflow-hidden rounded-[4px] bg-black text-white">
            <Image
              src="/images/e5659d572977438364a41d7e8c9d1e9a794d43ed.png"
              alt={t('speakers')}
              fill
              className="object-cover"
            />
            <CardOverlay />
            <CardContentSmall
              title={t('speakers')}
              description={t('speakersDesc')}
            />
          </div>

          <div className="relative overflow-hidden rounded-[4px] bg-black text-white">
            <Image
              src="/images/15315cd15102562cf220504d288fa568eaa816dd.png"
              alt={t('perfume')}
              fill
              className="object-cover"
            />
            <CardOverlay />
            <CardContentSmall
              title={t('perfume')}
              description={t('perfumeDesc')}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default NewArrival;