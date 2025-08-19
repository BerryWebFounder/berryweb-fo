export const useProductStore = defineStore('product', () => {
    const { $api } = useNuxtApp()

    const products = ref([])
    const featuredProducts = ref([])
    const shops = ref([])
    const currentProduct = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Get all shops
    const fetchShops = async (search = '', page = 0, size = 20) => {
        try {
            loading.value = true
            error.value = null

            const params = {
                page,
                size
            }

            if (search) {
                params.search = search
            }

            const response = await $api.shop.get('/v1/shops', { params })

            if (response.data.success) {
                shops.value = response.data.data.content || []
                return response.data.data
            } else {
                throw new Error(response.data.message || '상점 목록을 불러오는데 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Get shop by id
    const fetchShop = async (shopId) => {
        try {
            loading.value = true
            error.value = null

            const response = await $api.shop.get(`/v1/shops/${shopId}`)

            if (response.data.success) {
                return response.data.data
            } else {
                throw new Error(response.data.message || '상점 정보를 불러오는데 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Get products by shop
    const fetchProductsByShop = async (shopId, page = 0, size = 20) => {
        try {
            loading.value = true
            error.value = null

            const response = await $api.shop.get(`/v1/shops/${shopId}/products`, {
                params: { page, size }
            })

            if (response.data.success) {
                products.value = response.data.data.content || []
                return response.data.data
            } else {
                throw new Error(response.data.message || '상품 목록을 불러오는데 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Get product by id
    const fetchProduct = async (productId) => {
        try {
            loading.value = true
            error.value = null

            const response = await $api.shop.get(`/v1/products/${productId}`)

            if (response.data.success) {
                currentProduct.value = response.data.data
                return response.data.data
            } else {
                throw new Error(response.data.message || '상품 정보를 불러오는데 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Search products
    const searchProducts = async (keyword, page = 0, size = 20) => {
        try {
            loading.value = true
            error.value = null

            const response = await $api.shop.get('/v1/products/search', {
                params: { keyword, page, size }
            })

            if (response.data.success) {
                products.value = response.data.data.content || []
                return response.data.data
            } else {
                throw new Error(response.data.message || '상품 검색에 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Get featured products
    const fetchFeaturedProducts = async (page = 0, size = 20) => {
        try {
            loading.value = true
            error.value = null

            const response = await $api.shop.get('/v1/products/featured', {
                params: { page, size }
            })

            if (response.data.success) {
                featuredProducts.value = response.data.data.content || []
                return response.data.data
            } else {
                throw new Error(response.data.message || '추천 상품을 불러오는데 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Get product stock
    const fetchProductStock = async (productId) => {
        try {
            const response = await $api.inventory.get(`/v1/inventory/product/${productId}/total-stock`)
            return response.data || 0
        } catch (err) {
            console.error('Failed to fetch product stock:', err)
            return 0
        }
    }

    return {
        products: readonly(products),
        featuredProducts: readonly(featuredProducts),
        shops: readonly(shops),
        currentProduct: readonly(currentProduct),
        loading: readonly(loading),
        error: readonly(error),
        fetchShops,
        fetchShop,
        fetchProductsByShop,
        fetchProduct,
        searchProducts,
        fetchFeaturedProducts,
        fetchProductStock
    }
})