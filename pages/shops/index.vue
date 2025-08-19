<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">상점 둘러보기</h1>
      <p class="text-gray-600">다양한 상점에서 원하는 상품을 찾아보세요.</p>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="상점을 검색하세요..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <!-- Sort -->
        <div class="sm:w-48">
          <select
              v-model="sortBy"
              @change="handleSortChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created">최신순</option>
            <option value="name">이름순</option>
            <option value="products">상품수순</option>
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
      <button @click="loadShops" class="btn btn-primary">
        다시 시도
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="shops.length === 0" class="text-center py-16">
      <BuildingStorefrontIcon class="h-24 w-24 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-medium text-gray-900 mb-2">상점이 없습니다</h2>
      <p class="text-gray-600 mb-6">
        {{ searchQuery ? '검색 조건에 맞는 상점이 없습니다.' : '등록된 상점이 없습니다.' }}
      </p>
      <button v-if="searchQuery" @click="clearSearch" class="btn btn-primary">
        전체 상점 보기
      </button>
    </div>

    <!-- Shops Grid -->
    <div v-else>
      <!-- Results Info -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-gray-600">
          총 {{ totalElements }}개의 상점
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
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ShopCard
            v-for="shop in shops"
            :key="shop.id"
            :shop="shop"
        />
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <div
            v-for="shop in shops"
            :key="shop.id"
            class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4 flex-1">
              <!-- Shop Avatar -->
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {{ shop.name.charAt(0).toUpperCase() }}
              </div>

              <!-- Shop Info -->
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <NuxtLink
                      :to="`/shops/${shop.id}`"
                      class="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {{ shop.name }}
                  </NuxtLink>
                  <span
                      v-if="shop.isActive"
                      class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                  >
                    운영중
                  </span>
                </div>

                <p v-if="shop.description" class="text-gray-600 mb-3 line-clamp-2">
                  {{ shop.description }}
                </p>

                <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div v-if="shop.businessHours" class="flex items-center">
                    <ClockIcon class="h-4 w-4 mr-1" />
                    {{ shop.businessHours }}
                  </div>
                  <div v-if="shop.phone" class="flex items-center">
                    <PhoneIcon class="h-4 w-4 mr-1" />
                    {{ formatPhone(shop.phone) }}
                  </div>
                  <div class="flex items-center">
                    <CubeIcon class="h-4 w-4 mr-1" />
                    상품 {{ shop.productCount || 0 }}개
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col space-y-2 ml-4">
              <NuxtLink
                  :to="`/shops/${shop.id}`"
                  class="btn btn-primary text-sm"
              >
                상점 방문
              </NuxtLink>
              <NuxtLink
                  :to="`/shops/${shop.id}/products`"
                  class="btn btn-secondary text-sm"
              >
                상품 보기
              </NuxtLink>
            </div>
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
  BuildingStorefrontIcon,
  Squares2X2Icon,
  Bars3Icon,
  ClockIcon,
  PhoneIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'

const productStore = useProductStore()

const shops = computed(() => productStore.shops)
const loading = computed(() => productStore.loading)
const error = computed(() => productStore.error)

const searchQuery = ref('')
const sortBy = ref('created')
const viewMode = ref('grid')
const currentPage = ref(1)
const pageSize = ref(12)
const totalPages = ref(1)
const totalElements = ref(0)

// SEO
useHead({
  title: '상점 목록 - BerryWeb',
  meta: [
    { name: 'description', content: '다양한 상점에서 원하는 상품을 찾아보세요. BerryWeb의 우수한 상점들을 만나보세요.' }
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

// Format phone number
const formatPhone = (phone) => {
  if (!phone) return ''

  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return phone
}

// Handle search
const handleSearch = () => {
  currentPage.value = 1
  loadShops()
}

// Handle sort change
const handleSortChange = () => {
  currentPage.value = 1
  loadShops()
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  loadShops()
}

// Go to page
const goToPage = (page) => {
  currentPage.value = page
  loadShops()

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Load shops
const loadShops = async () => {
  try {
    const response = await productStore.fetchShops(
        searchQuery.value,
        currentPage.value - 1,
        pageSize.value
    )

    totalPages.value = response.totalPages || 1
    totalElements.value = response.totalElements || 0
  } catch (err) {
    console.error('Failed to load shops:', err)
  }
}

// Load shops on mount
onMounted(() => {
  loadShops()
})

// Watch for route query changes (for direct links with search)
watch(() => useRoute().query, (newQuery) => {
  if (newQuery.q && newQuery.q !== searchQuery.value) {
    searchQuery.value = newQuery.q
    currentPage.value = 1
    loadShops()
  }
}, { immediate: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>