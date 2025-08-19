<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            BerryWeb 쇼핑몰에 오신 것을 환영합니다
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100">
            최고의 상품을 최저의 가격으로 만나보세요
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
                to="/products"
                class="btn btn-primary bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              상품 둘러보기
            </NuxtLink>
            <NuxtLink
                to="/shops"
                class="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            >
              상점 둘러보기
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">추천 상품</h2>
          <p class="text-lg text-gray-600">엄선된 인기 상품들을 만나보세요</p>
        </div>

        <div v-if="loading" class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600">{{ error }}</p>
          <button @click="loadFeaturedProducts" class="btn btn-primary mt-4">
            다시 시도
          </button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
              v-for="product in featuredProducts"
              :key="product.id"
              :product="product"
          />
        </div>

        <div v-if="featuredProducts.length === 0 && !loading && !error" class="text-center py-8">
          <p class="text-gray-500">추천 상품이 없습니다.</p>
        </div>

        <div class="text-center mt-8">
          <NuxtLink to="/products" class="btn btn-primary">
            더 많은 상품 보기
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gray-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">왜 BerryWeb을 선택해야 할까요?</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TruckIcon class="h-8 w-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold mb-2">빠른 배송</h3>
            <p class="text-gray-600">전국 어디든 빠르고 안전한 배송 서비스를 제공합니다.</p>
          </div>

          <div class="text-center">
            <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon class="h-8 w-8 text-green-600" />
            </div>
            <h3 class="text-xl font-semibold mb-2">안전한 결제</h3>
            <p class="text-gray-600">다양한 결제 수단과 보안 시스템으로 안전하게 쇼핑하세요.</p>
          </div>

          <div class="text-center">
            <div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <HeartIcon class="h-8 w-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold mb-2">고객 만족</h3>
            <p class="text-gray-600">언제나 고객 만족을 최우선으로 하는 서비스를 제공합니다.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Shops -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">인기 상점</h2>
          <p class="text-lg text-gray-600">믿을 수 있는 우수한 상점들을 만나보세요</p>
        </div>

        <div v-if="shopsLoading" class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ShopCard
              v-for="shop in popularShops"
              :key="shop.id"
              :shop="shop"
          />
        </div>

        <div class="text-center mt-8">
          <NuxtLink to="/shops" class="btn btn-primary">
            모든 상점 보기
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { TruckIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/vue/24/outline'

const productStore = useProductStore()

const featuredProducts = computed(() => productStore.featuredProducts)
const popularShops = ref([])
const loading = computed(() => productStore.loading)
const error = computed(() => productStore.error)
const shopsLoading = ref(false)

// SEO
useHead({
  title: 'BerryWeb 쇼핑몰 - 최고의 온라인 쇼핑 경험',
  meta: [
    { name: 'description', content: '최고의 상품을 최저의 가격으로 만나보세요. BerryWeb에서 다양한 상품과 브랜드를 경험해보세요.' }
  ]
})

// Load featured products
const loadFeaturedProducts = async () => {
  try {
    await productStore.fetchFeaturedProducts(0, 8)
  } catch (err) {
    console.error('Failed to load featured products:', err)
  }
}

// Load popular shops
const loadPopularShops = async () => {
  try {
    shopsLoading.value = true
    const response = await productStore.fetchShops('', 0, 6)
    popularShops.value = response.content || []
  } catch (err) {
    console.error('Failed to load popular shops:', err)
  } finally {
    shopsLoading.value = false
  }
}

onMounted(() => {
  loadFeaturedProducts()
  loadPopularShops()
})
</script>