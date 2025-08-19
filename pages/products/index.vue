<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">전체 상품</h1>
      <p class="text-gray-600">다양한 상품을 둘러보고 원하는 상품을 찾아보세요.</p>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="상품을 검색하세요..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <!-- Category Filter -->
        <div class="lg:w-48">
          <select
              v-model="selectedCategory"
              @change="handleCategoryChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체 카테고리</option>
            <option value="electronics">전자제품</option>
            <option value="fashion">패션</option>
            <option value="home">홈&리빙</option>
            <option value="beauty">뷰티</option>
            <option value="sports">스포츠</option>
            <option value="books">도서</option>
          </select>
        </div>

        <!-- Price Range -->
        <div class="lg:w-48">
          <select
              v-model="priceRange"
              @change="handlePriceChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체 가격</option>
            <option value="0-10000">1만원 이하</option>
            <option value="10000-50000">1만원 - 5만원</option>
            <option value="50000-100000">5만원 - 10만원</option>
            <option value="100000-">10만원 이상</option>
          </select>
        </div>

        <!-- Sort -->
        <div class="lg:w-48">
          <select
              v-model="sortBy"
              @change="handleSortChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="latest">최신순</option>
            <option value="price_low">가격 낮은순</option>
            <option value="price_high">가격 높은순</option>
            <option value="rating">평점순</option>
            <option value="sales">판매순</option>
          </select>
        </div>

        <!-- Search Button -->
        <button
            @click="handleSearch"
            class="btn btn-primary px-6"
        >
          검색
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="loadProducts" class="btn btn-primary">
        다시 시도
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="text-center py-16">
      <CubeIcon class="h-24 w-24 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-medium text-gray-900 mb-2">상품이 없습니다</h2>
      <p class="text-gray-600 mb-6">
        {{ searchQuery ? '검색 조건에 맞는 상품이 없습니다.' : '등록된 상품이 없습니다.' }}
      </p>
      <button v-if="searchQuery" @click="clearFilters" class="btn btn-primary">
        전체 상품 보기
      </button>
    </div>

    <!-- Products Grid -->
    <div v-else>
      <!-- Results Info -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-gray-600">
          총 {{ totalElements }}개의 상품
          <span v-if="searchQuery" class="font-medium">"{{ searchQuery }}"</span>
        </p>

        <div class="flex items-center space-x-2">
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

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
        />
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <div
            v-for="product in products"
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
                <NuxtLink :to="`/shops/${product.shopId}`" class="text-sm text-blue-600 hover:text-blue-800">
                  {{ product.shopName }}
                </NuxtLink>
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
  CubeIcon,
  Squares2X2Icon,
  Bars3Icon,
  StarIcon
} from '@heroicons/vue/24/outline'

const productStore = useProductStore()
const cartStore = useCartStore()

const products = computed(() => productStore.products)
const loading = computed(() => productStore.loading)
const error = computed(() => productStore.error)

const searchQuery = ref('')
const selectedCategory = ref('')
const priceRange = ref('')
const sortBy = ref('latest')
const viewMode = ref('grid')
const currentPage = ref(1)
const pageSize = ref(16)
const totalPages = ref(1)
const totalElements = ref(0)

// SEO
useHead({
  title: '전체 상품 - BerryWeb',
  meta: [
    { name: 'description', content: 'BerryWeb의 다양한 상품들을 둘러보고 원하는 상품을 찾아보세요.' }
  ]
})

// Visible pages for pagination
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
  currentPage.value = 1
  loadProducts()
}

// Handle category change
const handleCategoryChange = () => {
  currentPage.value = 1
  loadProducts()
}

// Handle price change
const handlePriceChange = () => {
  currentPage.value = 1
  loadProducts()
}

// Handle sort change
const handleSortChange = () => {
  currentPage.value = 1
  loadProducts()
}

// Clear filters
const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  priceRange.value = ''
  sortBy.value = 'latest'
  currentPage.value = 1
  loadProducts()
}

// Go to page
const goToPage = (page) => {
  currentPage.value = page
  loadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Load products
const loadProducts = async () => {
  try {
    const response = await productStore.searchProducts(
        searchQuery.value,
        currentPage.value - 1,
        pageSize.value
    )

    totalPages.value = response.totalPages || 1
    totalElements.value = response.totalElements || 0
  } catch (err) {
    console.error('Failed to load products:', err)
  }
}

// Load products on mount
onMounted(() => {
  loadProducts()
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