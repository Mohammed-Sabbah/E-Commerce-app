import type { ProductsResponse } from '@/types/api'

export async function fetchProducts(params: Record<string, string | number>): Promise<ProductsResponse> {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') query.append(key, String(value))
    })

    const res = await fetch(`/api/v1/products?${query.toString()}`, {
        cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
}