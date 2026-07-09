import { notFound } from 'next/navigation'
import ProductGallery from '@/components/ProductDetailesPage/ProductGallery'
import ProductOptions from '@/components/ProductDetailesPage/ProductOptions'
import ProductActions from '@/components/ProductDetailesPage/ProductActions'
import { getProductById } from '@/services/server/pruductService'
import ProductDetailesComponent from '@/components/ProductDetailesPage/ProductDetailesComponent'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params
    const data = await getProductById(id)

    if (!data) notFound()

    const product = data.data.doc

    return (
        <ProductDetailesComponent product={product} />
    )
}

