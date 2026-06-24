import { getProducts, getCategories } from '@/services/server/pruductService'
import ProductsClient from '../../components/Products/ProductsClient'

interface PageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams

    const keyword = params.keyword
    const category = params.category
    const sort = params.sort || '-createdAt'
    const priceMin = params.priceMin
    const priceMax = params.priceMax
    const discount = params.discount

    const queryParams: Record<string, string | number> = {
        limit: 12,
        sort,
    }
    if (keyword) queryParams.keyword = keyword
    if (category) queryParams.category = category
    if (priceMin) queryParams['price[gte]'] = Number(priceMin)
    if (priceMax) queryParams['price[lte]'] = Number(priceMax)
    if (discount === "true") queryParams['discount'] = 'true'

    const [productsData, categoriesData] = await Promise.all([
        getProducts(queryParams),
        getCategories()
    ])

    const products = productsData?.data?.docs ?? []
    const categories = categoriesData?.data?.docs ?? []
    const total = productsData?.totalCount ?? 0

    return (
        <ProductsClient
            initialProducts={products}
            categories={categories}
            total={total}
            initialParams={params}
        />
    )
}