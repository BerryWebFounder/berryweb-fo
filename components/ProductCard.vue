<template>
  <div class="card hover:shadow-lg transition-shadow duration-300 group">
    <!-- Product Image -->
    <div class="relative overflow-hidden rounded-t-lg">
      <NuxtLink :to="`/products/${product.id}`">
        <img
            :src="productImage"
            :alt="product.name"
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            @error="handleImageError"
        >
      </NuxtLink>

      <!-- Featured Badge -->
      <div v-if="product.isFeatured" class="absolute top-2 left-2">
        <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          추천
        </span>
      </div>

      <!-- Quick Actions -->
      <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
            @click="toggleWishlist"
            class="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
            :class="{ 'text-red-500': isInWishlist, 'text-gray-400': !isInWishlist }"
        >
          <HeartIcon class="h-5 w-5" :class="{ 'fill-current': isInWishlist }" />
        </button>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Product Name -->
      <NuxtLink :to="`/products/${product.id}`">
        <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {{ product.name }}
        </h3>
      </NuxtLink>

      <!-- Product Description -->
      <p v-if="product.shortDescription" class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ product.shortDescription }}
      </p>

      <!-- Rating -->
      <div v-if="product.ratingAverage && product.ratingCount" class="flex items-center mb-3">
        <div class="flex items-center">
          <StarIcon
              v-for="i in 5"
              :key="i"
              class="h-4 w-4"
              :class="i <= Math.floor(product.ratingAverage) ? 'text-yellow-400 fill-current' : 'text-gray-300'"
          />
        </div>
        <span class="text-sm text-gray-600 ml-2">
          {{ product.ratingAverage.toFixed(1) }} ({{ product.ratingCount }})
        </span>
      </div>

      <!-- Price -->
      <div class="mb-4">
        <div v-if="product.salePrice && product.salePrice < product.price" class="space-y-1">
          <div class="price-original">
            {{ formatPrice(product.price) }}
          </div>
          <div class="price price-sale">
            {{ formatPrice(product.salePrice) }}
          </div>
          <div class="text-sm text-red-500">
            {{ Math.round(((product.price - product.salePrice) / product.price) * 100) }}% 할인
          </div>
        </div>
        <div v-else class="price">
          {{ formatPrice(product.price) }}
        </div>
      </div>

      <!-- Add to Cart Button -->
      <div class="flex gap-2">
        <button
            @click="addToCart"
            :disabled="!isAvailable"
            class="flex-1 btn btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ShoppingCartIcon class="h-4 w-4 mr-2" />
          {{ isInCart ? '장바구니에 있음' : '장바구니에 담기' }}
        </button>

        <button
            @click="quickView"
            class="btn btn-secondary px-3"
            title="빠른 보기"
        >
          <EyeIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const isInCart = computed(() => cartStore.isInCart(props.product.id))
const isInWishlist = ref(false) // TODO: Implement wishlist functionality
const isAvailable = computed(() => props.product.status === 'ACTIVE')

// Product image with fallback
const productImage = computed(() => {
  if (props.product.mainImage?.storedFilename) {
    return `/uploads/${props.product.mainImage.storedFilename}`
  }
  return '/images/no-image.png'
})

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/images/no-image.png'
}

// Add to cart
const addToCart = () => {
  if (!isAvailable.value) return

  cartStore.addItem(props.product, 1)

  // Show success message
  // TODO: Add toast notification
  console.log('Added to cart:', props.product.name)
}

// Toggle wishlist
const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  // TODO: Implement wishlist API
  console.log('Wishlist toggled:', props.product.name)
}

// Quick view
const quickView = () => {
  // TODO: Implement quick view modal
  navigateTo(`/products/${props.product.id}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>