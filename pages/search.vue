<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Search Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        검색 결과
        <span v-if="searchQuery" class="text-blue-600">"{{ searchQuery }}"</span>
      </h1>
      <p v-if="searchQuery" class="text-gray-600">
        "{{ searchQuery }}"에 대한 검색 결과입니다.
      </p>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div class="flex gap-4">
        <div class="flex-1 relative">
          <input
              v-model="currentSearchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="상품, 상점을 검색하세요..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <button
            @click="handleSearch"
            class="btn btn-primary px-8"
        >
          검색
        </button>
      </div>
    </div>

    <!-- Search Filters -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div class="flex flex-wrap gap-4 items-center">
        <!-- Search Type -->
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700">검색 대상:</span>
          <div class="flex space-x-1">
            <button
                @click="searchType = 'all'"
                :class="searchType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
                class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              전체
            </button>
            <button
                @click="searchType = 'products'"
                :class="searchType === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
                class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              상품
            </button>
            <button
                @click="searchType = 'shops'"
                :class="searchType === 'shops' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
                class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              상점
            </button>
          </div>
        </div>

        <!-- Sort -->
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700">정렬:</span>
          <select
              v-model="sortBy"
              @change="handleSortChange"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevance">관련도순</option>
            <option value="latest">최신순</option>
            <option value="price_low">가격 낮은순</option>
            <option value="price_high">가격 높은순</option>
            <option value="rating">평점순</option>
          </select>
        </div>

        <!-- View Mode (for products) -->
        <div v-if="searchType === 'products' || searchType === 'all'" class="flex items-center space-x-2 ml-auto">
          <button
              @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400'"
              class="p-2 hover:text-blue-600"
          >
            <Squares2X2Icon class="h-5 w-5" />
          </button>
          <button
              @click="viewMode = 'list'"
              :class="viewMode === 'list' ? 'text-blue-600' : 'text-gray-400'"
              class="p-2 hover:text-blue-600"
          >
            <Bars3Icon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="performSearch" class="btn btn-primary">
        다시 시도
      </button>
    </div>

    <!-- No Results -->
    <div v-else-if="!hasResults" class="text-center py-16">
      <MagnifyingGlassIcon class="h-24 w-24 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-medium text-gray-900 mb-2">검색 결과가 없습니다</h2>
      <p class="text-gray-600 mb-6">
        다른 검색어로 시도해보세요.
      </p>
      <div class="space-x-4">
        <button @click="clearSearch" class="btn btn-primary">
          전체 상품 보기
        </button>
        <NuxtLink to="/shops" class="btn btn-secondary">
          상점 둘러보기
        </NuxtLink>
      </div>
    </div>

    <!-- Results -->
    <div v-else class="space-y-8">
      <!-- Products Section -->
      <div v-if="(searchType === 'all' || searchType === 'products') && products.length > 0">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">
            상품 {{ productsTotalElements }}개
          </h2>
          <NuxtLink
              v-if="searchType === 'all' && productsTotalElements > 4"
              to="/search?type=products"
              class="text-sm text-blue-600 hover:text-blue-800"
          >
            상품 전체 보기
          </NuxtLink>
        </div>

        <!-- Products Grid -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
              v-for="product in displayProducts"
              :key="product.id"
              :product="product"
          />
        </div>

        <!-- Products List -->
        <div v-else class="space-y-4">
          <div
              v-for="product in displayProducts"
              :key="product.id"
              class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start space-x-4">
              <img
                  :src="getProductImage(product)"
                  :alt="product.name"
                  class="w-24 h-24 rounded-lg object-cover"
                  @error="handleImageError"
              >
              <div class="flex-1">
                <NuxtLink
                    :to="`/products/${product.id}`"
                    class="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {{ product.name }}
                </NuxtLink>
                <p v-if="product.shortDescription" class="text-gray-600 mt-1 line-clamp-2">
                  {{ product.shortDescription }}
                </p>
                <div class="flex items-center space-x-4 mt-3">
                  <div class="text-lg font-bold text-gray-900">
                    {{ formatPrice(product.salePrice || product.price) }}
                  </div>
                  <div v-if="product.ratingAverage" class="flex items-center">
                    <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
                    <span class="text-sm text-gray-600 ml-1">
                      {{ product.ratingAverage.toFixed(1) }}
                    </span>
                  </div>
                </div>
              </div>
              <button
                  @click="addToCart(product)"
                  class="btn btn-primary"
              >
                장바구니
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Shops Section -->
      <div v-if="(searchType === 'all' || searchType === 'shops') && shops.length > 0">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">
            상점 {{ shopsTotalElements }}개
          </h2>
          <NuxtLink
              v-if="searchType === 'all' && shopsTotalElements > 3"
              to="/search?type=shops"
              class="text-sm text-blue-600 hover:text-blue-800"
          >
            상점 전체 보기
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ShopCard
              v-for="shop in displayShops"
              :key="shop.id"
              :shop="shop"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12">
        <nav class="flex space-x-2">
          <button
              v-if="currentPage > 1"
              @click="goToPage(currentPage - 1)"
              class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            이전
          </button>

          <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="currentPage === page
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'"
          >
            {{ page }}
          </button>

          <button
              v-if="currentPage < totalPages"
              @click="goToPage(currentPage + 1)"
              class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            다음
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  Bars3Icon,
  StarIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

const products = ref([])
const shops = ref([])
const loading = ref(false)
const error = ref('')

const searchQuery = ref('')
const currentSearchQuery = ref('')
const searchType = ref('all')
const sortBy = ref('relevance')
const viewMode = ref('grid')
const currentPage = ref(1)
const pageSize = ref(12)
const totalPages = ref(1)
const productsTotalElements = ref(0)
const shopsTotalElements = ref(0)

// SEO
watchEffect(() => {
  const title = searchQuery.value
      ? `"${searchQuery.value}" 검색 결과 - BerryWeb`
      : '검색 - BerryWeb'

  useHead({
    title,
    meta: [
      { name: 'description', content: searchQuery.value
            ? `"${searchQuery.value}"에 대한 검색 결과를 확인하세요.`
            : 'BerryWeb에서 원하는 상품과 상점을 검색하세요.'
      }
    ]
  })
})

// Computed properties
const hasResults = computed(() => {
  return products.value.length > 0 || shops.value.length > 0
})

const displayProducts = computed(() => {
  if (searchType.value === 'all') {
    return products.value.slice(0, 8) // Show limited results in 'all' mode
  }
  return products.value
})

const displayShops = computed(() => {
  if (searchType.value === 'all') {
    return shops.value.slice(0, 6) // Show limited results in 'all' mode
  }
  return shops.value
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Get product image
const getProductImage = (product) => {
  if (product.mainImage?.storedFilename) {
    return `/uploads/${product.mainImage.storedFilename}`
  }
  return '/images/no-image.png'
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/images/no-image.png'
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

// Add to cart
const addToCart = (product) => {
  cartStore.addItem(product, 1)
  // TODO: Show toast notification
  console.log('Added to cart:', product.name)
}

// Handle search
const handleSearch = () => {
  searchQuery.value = currentSearchQuery.value
  currentPage.value = 1
  performSearch()

  // Update URL
  navigateTo({
    path: '/search',
    query: {
      q: searchQuery.value,
      type: searchType.value !== 'all' ? searchType.value : undefined,
      sort: sortBy.value !== 'relevance' ? sortBy.value : undefined
    }
  })
}

// Handle sort change
const handleSortChange = () => {
  currentPage.value = 1
  performSearch()
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  currentSearchQuery.value = ''
  navigateTo('/products')
}

// Go to page
const goToPage = (page) => {
  currentPage.value = page
  performSearch()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Perform search
const performSearch = async () => {
  if (!searchQuery.value) return

  try {
    loading.value = true
    error.value = ''

    const promises = []

    // Search products
    if (searchType.value === 'all' || searchType.value === 'products') {
      promises.push(
          productStore.searchProducts(
              searchQuery.value,
              currentPage.value - 1,
              searchType.value === 'all' ? 8 : pageSize.value
          ).then(response => {
            products.value = response.content || []
            productsTotalElements.value = response.totalElements || 0
            if (searchType.value === 'products') {
              totalPages.value = response.totalPages || 1
            }
          })
      )
    }

    // Search shops
    if (searchType.value === 'all' || searchType.value === 'shops') {
      promises.push(
          productStore.fetchShops(
              searchQuery.value,
              currentPage.value - 1,
              searchType.value === 'all' ? 6 : pageSize.value
          ).then(response => {
            shops.value = response.content || []
            shopsTotalElements.value = response.totalElements || 0
            if (searchType.value === 'shops') {
              totalPages.value = response.totalPages || 1
            }
          })
      )
    }

    await Promise.all(promises)

    // Set total pages for 'all' search type
    if (searchType.value === 'all') {
      const maxElements = Math.max(productsTotalElements.value, shopsTotalElements.value)
      totalPages.value = Math.ceil(maxElements / pageSize.value)
    }

  } catch (err) {
    error.value = '검색 중 오류가 발생했습니다.'
    console.error('Search failed:', err)
  } finally {
    loading.value = false
  }
}

// Watch for search type changes
watch(searchType, () => {
  currentPage.value = 1
  if (searchQuery.value) {
    performSearch()
  }
})

// Initialize from route query
onMounted(() => {
  const query = route.query.q
  const type = route.query.type || 'all'
  const sort = route.query.sort || 'relevance'

  if (query) {
    searchQuery.value = query
    currentSearchQuery.value = query
    searchType.value = type
    sortBy.value = sort
    performSearch()
  }
})

// Watch for route changes
watch(() => route.query, (newQuery) => {
  if (newQuery.q !== searchQuery.value) {
    searchQuery.value = newQuery.q || ''
    currentSearchQuery.value = newQuery.q || ''
    searchType.value = newQuery.type || 'all'
    sortBy.value = newQuery.sort || 'relevance'

    if (newQuery.q) {
      performSearch()
    }
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>