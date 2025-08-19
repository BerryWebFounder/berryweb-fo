<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="loadProduct" class="btn btn-primary">
        다시 시도
      </button>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Product Images -->
      <div class="space-y-4">
        <!-- Main Image -->
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
              :src="currentImage"
              :alt="product.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
          >
        </div>

        <!-- Thumbnail Images -->
        <div v-if="product.images && product.images.length > 1" class="flex gap-2 overflow-x-auto">
          <button
              v-for="(image, index) in product.images"
              :key="image.id"
              @click="setCurrentImage(image)"
              class="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2"
              :class="{ 'border-blue-500': currentImageIndex === index, 'border-transparent': currentImageIndex !== index }"
          >
            <img
                :src="getImageUrl(image)"
                :alt="`${product.name} ${index + 1}`"
                class="w-full h-full object-cover"
                @error="handleImageError"
            >
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <!-- Breadcrumb -->
        <nav class="text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-blue-600">홈</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink :to="`/shops/${product.shopId}`" class="hover:text-blue-600">
            {{ product.shopName }}
          </NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-gray-900">{{ product.name }}</span>
        </nav>

        <!-- Product Title -->
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {{ product.name }}
          </h1>
          <p v-if="product.shortDescription" class="text-gray-600">
            {{ product.shortDescription }}
          </p>
        </div>

        <!-- Rating -->
        <div v-if="product.ratingAverage && product.ratingCount" class="flex items-center">
          <div class="flex items-center">
            <StarIcon
                v-for="i in 5"
                :key="i"
                class="h-5 w-5"
                :class="i <= Math.floor(product.ratingAverage) ? 'text-yellow-400 fill-current' : 'text-gray-300'"
            />
          </div>
          <span class="ml-2 text-gray-600">
            {{ product.ratingAverage.toFixed(1) }} ({{ product.ratingCount }}개 리뷰)
          </span>
        </div>

        <!-- Price -->
        <div class="space-y-2">
          <div v-if="product.salePrice && product.salePrice < product.price">
            <div class="text-lg text-gray-500 line-through">
              {{ formatPrice(product.price) }}
            </div>
            <div class="text-3xl font-bold text-red-600">
              {{ formatPrice(product.salePrice) }}
            </div>
            <div class="text-sm text-red-500">
              {{ Math.round(((product.price - product.salePrice) / product.price) * 100) }}% 할인
            </div>
          </div>
          <div v-else class="text-3xl font-bold text-gray-900">
            {{ formatPrice(product.price) }}
          </div>
        </div>

        <!-- Stock Status -->
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">재고:</span>
          <span
              v-if="product.stockQuantity > 0"
              class="text-sm text-green-600 font-medium"
          >
            {{ product.stockQuantity }}개 재고 있음
          </span>
          <span
              v-else
              class="text-sm text-red-600 font-medium"
          >
            품절
          </span>
        </div>

        <!-- Product Options -->
        <div v-if="product.optionGroups && product.optionGroups.length > 0" class="space-y-4">
          <div
              v-for="optionGroup in product.optionGroups"
              :key="optionGroup.id"
              class="space-y-2"
          >
            <label class="block text-sm font-medium text-gray-700">
              {{ optionGroup.name }}
              <span v-if="optionGroup.isRequired" class="text-red-500">*</span>
            </label>

            <select
                v-if="optionGroup.type === 'SELECT'"
                v-model="selectedOptions[optionGroup.id]"
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택해주세요</option>
              <option
                  v-for="option in optionGroup.options"
                  :key="option.id"
                  :value="option.id"
                  :disabled="!option.isActive"
              >
                {{ option.name }}
                <span v-if="option.additionalPrice > 0">
                  (+{{ formatPrice(option.additionalPrice) }})
                </span>
              </option>
            </select>

            <div
                v-else-if="optionGroup.type === 'RADIO'"
                class="space-y-2"
            >
              <label
                  v-for="option in optionGroup.options"
                  :key="option.id"
                  class="flex items-center"
              >
                <input
                    v-model="selectedOptions[optionGroup.id]"
                    type="radio"
                    :value="option.id"
                    :disabled="!option.isActive"
                    class="mr-2"
                >
                <span>{{ option.name }}</span>
                <span v-if="option.additionalPrice > 0" class="ml-1 text-gray-600">
                  (+{{ formatPrice(option.additionalPrice) }})
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Quantity -->
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-700">수량:</span>
          <div class="flex items-center border border-gray-300 rounded-md">
            <button
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
            >
              <MinusIcon class="h-4 w-4" />
            </button>
            <input
                v-model.number="quantity"
                type="number"
                min="1"
                :max="product.maxOrderQuantity || product.stockQuantity"
                class="w-16 px-2 py-2 text-center border-0 focus:outline-none"
            >
            <button
                @click="increaseQuantity"
                :disabled="quantity >= (product.maxOrderQuantity || product.stockQuantity)"
                class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
            >
              <PlusIcon class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Total Price -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="text-lg font-medium">총 가격:</span>
            <span class="text-2xl font-bold text-blue-600">
              {{ formatPrice(totalPrice) }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
              @click="addToCart"
              :disabled="!canAddToCart"
              class="w-full btn btn-primary py-3 text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon class="h-5 w-5 mr-2" />
            장바구니에 담기
          </button>

          <button
              @click="buyNow"
              :disabled="!canAddToCart"
              class="w-full btn bg-green-600 text-white hover:bg-green-700 py-3 text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            바로 구매하기
          </button>
        </div>
      </div>
    </div>

    <!-- Product Description -->
    <div v-if="product && product.description" class="mt-16">
      <div class="border-t pt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">상품 설명</h2>
        <div class="prose max-w-none" v-html="product.description"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  StarIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

const product = computed(() => productStore.currentProduct)
const loading = computed(() => productStore.loading)
const error = computed(() => productStore.error)

const quantity = ref(1)
const selectedOptions = ref({})
const currentImageIndex = ref(0)

// Current image
const currentImage = computed(() => {
  if (product.value?.images && product.value.images.length > 0) {
    return getImageUrl(product.value.images[currentImageIndex.value])
  }
  return '/images/no-image.png'
})

// Total price calculation
const totalPrice = computed(() => {
  if (!product.value) return 0

  const basePrice = product.value.salePrice || product.value.price
  let optionsPrice = 0

  // Calculate options additional price
  if (product.value.optionGroups) {
    for (const group of product.value.optionGroups) {
      const selectedOptionId = selectedOptions.value[group.id]
      if (selectedOptionId) {
        const option = group.options.find(opt => opt.id === selectedOptionId)
        if (option) {
          optionsPrice += option.additionalPrice || 0
        }
      }
    }
  }

  return (basePrice + optionsPrice) * quantity.value
})

// Can add to cart check
const canAddToCart = computed(() => {
  if (!product.value || product.value.stockQuantity <= 0) return false

  // Check required options
  if (product.value.optionGroups) {
    for (const group of product.value.optionGroups) {
      if (group.isRequired && !selectedOptions.value[group.id]) {
        return false
      }
    }
  }

  return true
})

// SEO
watchEffect(() => {
  if (product.value) {
    useHead({
      title: `${product.value.name} - BerryWeb`,
      meta: [
        { name: 'description', content: product.value.shortDescription || product.value.name }
      ]
    })
  }
})

// Get image URL
const getImageUrl = (image) => {
  if (image?.storedFilename) {
    return `/uploads/${image.storedFilename}`
  }
  return '/images/no-image.png'
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/images/no-image.png'
}

// Set current image
const setCurrentImage = (image) => {
  const index = product.value.images.findIndex(img => img.id === image.id)
  if (index !== -1) {
    currentImageIndex.value = index
  }
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

// Quantity controls
const increaseQuantity = () => {
  const maxQty = product.value.maxOrderQuantity || product.value.stockQuantity
  if (quantity.value < maxQty) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// Add to cart
const addToCart = () => {
  if (!canAddToCart.value) return

  const options = {}
  for (const [groupId, optionId] of Object.entries(selectedOptions.value)) {
    if (optionId) {
      const group = product.value.optionGroups.find(g => g.id == groupId)
      const option = group?.options.find(o => o.id == optionId)
      if (group && option) {
        options[group.name] = option.name
      }
    }
  }

  cartStore.addItem(product.value, quantity.value, options)

  // Show success message
  // TODO: Add toast notification
  console.log('Added to cart:', product.value.name)
}

// Buy now
const buyNow = () => {
  addToCart()
  navigateTo('/cart')
}

// Load product
const loadProduct = async () => {
  try {
    await productStore.fetchProduct(route.params.id)
  } catch (err) {
    console.error('Failed to load product:', err)
  }
}

onMounted(() => {
  loadProduct()
})
</script>