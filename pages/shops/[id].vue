<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="loadShop" class="btn btn-primary">
        다시 시도
      </button>
    </div>

    <div v-else-if="shop" class="space-y-8">
      <!-- Breadcrumb -->
      <nav class="text-sm text-gray-600">
        <NuxtLink to="/" class="hover:text-blue-600">홈</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/shops" class="hover:text-blue-600">상점</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-gray-900">{{ shop.name }}</span>
      </nav>

      <!-- Shop Header -->
      <div class="bg-white rounded-lg shadow-sm border p-8">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-6">
            <!-- Shop Avatar -->
            <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {{ shop.name.charAt(0).toUpperCase() }}
            </div>

            <!-- Shop Info -->
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <h1 class="text-3xl font-bold text-gray-900">{{ shop.name }}</h1>
                <span
                    v-if="shop.isActive"
                    class="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                >
                  운영중
                </span>
                <span
                    v-else
                    class="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full"
                >
                  휴업중
                </span>
              </div>

              <p v-if="shop.description" class="text-gray-600 text-lg mb-4">
                {{ shop.description }}
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <!-- Business Hours -->
                <div v-if="shop.businessHours" class="flex items-center text-gray-600">
                  <ClockIcon class="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{{ shop.businessHours }}</span>
                </div>

                <!-- Phone -->
                <div v-if="shop.phone" class="flex items-center text-gray-600">
                  <PhoneIcon class="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{{ formatPhone(shop.phone) }}</span>
                </div>

                <!-- Email -->
                <div v-if="shop.email" class="flex items-center text-gray-600">
                  <EnvelopeIcon class="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{{ shop.email }}</span>
                </div>

                <!-- Address -->
                <div v-if="shop.address" class="flex items-center text-gray-600">
                  <MapPinIcon class="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{{ shop.address }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col space-y-3">
            <button
                @click="followShop"
                :class="isFollowing ? 'btn bg-gray-200 text-gray-700' : 'btn btn-primary'"
            >
              <HeartIcon class="h-4 w-4 mr-2" :class="{ 'fill-current text-red-500': isFollowing }" />
              {{ isFollowing ? '팔로잉' : '팔로우' }}
            </button>
            <button class="btn btn-secondary">
              <ShareIcon class="h-4 w-4 mr-2" />
              공유하기
            </button>
          </div>
        </div>
      </div>

      <!-- Shop Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div class="text-2xl font-bold text-blue-600 mb-2">{{ shop.productCount || 0 }}</div>
          <div class="text-sm text-gray-600">등록 상품</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div class="text-2xl font-bold text-green-600 mb-2">{{ shop.followerCount || 0 }}</div>
          <div class="text-sm text-gray-600">팔로워</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div class="text-2xl font-bold text-purple-600 mb-2">{{ shop.orderCount || 0 }}</div>
          <div class="text-sm text-gray-600">총 주문</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div class="text-2xl font-bold text-yellow-600 mb-2">
            {{ shop.ratingAverage ? shop.ratingAverage.toFixed(1) : '0.0' }}
          </div>
          <div class="text-sm text-gray-600">평점</div>
        </div>
      </div>

      <!-- Delivery Info -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">배송 정보</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div class="text-sm text-gray-600 mb-1">최소 주문금액</div>
            <div class="text-lg font-semibold">
              {{ shop.minOrderAmount ? formatPrice(shop.minOrderAmount) : '제한 없음' }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-600 mb-1">배송비</div>
            <div class="text-lg font-semibold">
              {{ shop.deliveryFee ? formatPrice(shop.deliveryFee) : '무료' }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-600 mb-1">무료배송 조건</div>
            <div class="text-lg font-semibold">
              {{ shop.freeDeliveryAmount ? `${formatPrice(shop.freeDeliveryAmount)} 이상` : '항상 무료' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">상품 목록</h2>
          <NuxtLink
              :to="`/shops/${shop.id}/products`"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            전체 보기 →
          </NuxtLink>
        </div>

        <div v-if="productsLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-12">
          <CubeIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">등록된 상품이 없습니다.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
              v-for="product in products.slice(0, 8)"
              :key="product.id"
              :product="product"
          />
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">리뷰</h2>
          <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
            전체 보기 →
          </button>
        </div>

        <div class="text-center py-12">
          <StarIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">리뷰가 없습니다.</p>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">문의하기</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">연락처 정보</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <div v-if="shop.phone" class="flex items-center">
                <PhoneIcon class="h-4 w-4 mr-2" />
                {{ formatPhone(shop.phone) }}
              </div>
              <div v-if="shop.email" class="flex items-center">
                <EnvelopeIcon class="h-4 w-4 mr-2" />
                {{ shop.email }}
              </div>
              <div v-if="shop.businessHours" class="flex items-center">
                <ClockIcon class="h-4 w-4 mr-2" />
                {{ shop.businessHours }}
              </div>
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">빠른 문의</h3>
            <div class="space-y-3">
              <button class="w-full btn btn-primary">
                <ChatBubbleLeftIcon class="h-4 w-4 mr-2" />
                채팅 문의
              </button>
              <button class="w-full btn btn-secondary">
                <PhoneIcon class="h-4 w-4 mr-2" />
                전화 문의
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  HeartIcon,
  ShareIcon,
  CubeIcon,
  StarIcon,
  ChatBubbleLeftIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const productStore = useProductStore()

const shop = ref(null)
const products = ref([])
const loading = ref(false)
const productsLoading = ref(false)
const error = ref('')
const isFollowing = ref(false) // TODO: Implement follow functionality

// SEO
watchEffect(() => {
  if (shop.value) {
    useHead({
      title: `${shop.value.name} - BerryWeb`,
      meta: [
        { name: 'description', content: shop.value.description || `${shop.value.name}의 상품을 둘러보세요.` }
      ]
    })
  }
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

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

// Follow shop
const followShop = () => {
  isFollowing.value = !isFollowing.value
  // TODO: Implement follow API
  console.log('Follow toggled:', shop.value.name)
}

// Load shop
const loadShop = async () => {
  try {
    loading.value = true
    error.value = ''

    shop.value = await productStore.fetchShop(route.params.id)
  } catch (err) {
    error.value = err.message
    console.error('Failed to load shop:', err)
  } finally {
    loading.value = false
  }
}

// Load shop products
const loadShopProducts = async () => {
  try {
    productsLoading.value = true

    const response = await productStore.fetchProductsByShop(route.params.id, 0, 8)
    products.value = response.content || []
  } catch (err) {
    console.error('Failed to load shop products:', err)
  } finally {
    productsLoading.value = false
  }
}

onMounted(() => {
  loadShop()
  loadShopProducts()
})
</script>