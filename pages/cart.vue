<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">장바구니</h1>
      <div class="text-sm text-gray-600">
        총 {{ cartStore.totalItems }}개 상품
      </div>
    </div>

    <div v-if="cartStore.items.length === 0" class="text-center py-16">
      <ShoppingCartIcon class="h-24 w-24 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h2>
      <p class="text-gray-600 mb-6">원하는 상품을 장바구니에 담아보세요!</p>
      <NuxtLink to="/products" class="btn btn-primary">
        상품 둘러보기
      </NuxtLink>
    </div>

    <div v-else class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
      <!-- Cart Items -->
      <div class="lg:col-span-7">
        <div class="bg-white rounded-lg shadow-sm border">
          <!-- Select All -->
          <div class="px-6 py-4 border-b border-gray-200">
            <label class="flex items-center">
              <input
                  v-model="selectAll"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
              <span class="ml-2 text-sm font-medium text-gray-900">전체 선택</span>
            </label>
          </div>

          <!-- Cart Item List -->
          <div class="divide-y divide-gray-200">
            <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="px-6 py-6"
            >
              <div class="flex items-start">
                <!-- Checkbox -->
                <input
                    v-model="selectedItems"
                    :value="item.id"
                    type="checkbox"
                    class="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >

                <!-- Product Image -->
                <div class="ml-4 flex-shrink-0">
                  <img
                      :src="getProductImage(item.product)"
                      :alt="item.product.name"
                      class="w-20 h-20 rounded-lg object-cover"
                      @error="handleImageError"
                  >
                </div>

                <!-- Product Info -->
                <div class="ml-4 flex-1">
                  <div class="flex justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900">
                        <NuxtLink
                            :to="`/products/${item.product.id}`"
                            class="hover:text-blue-600"
                        >
                          {{ item.product.name }}
                        </NuxtLink>
                      </h3>

                      <!-- Product Options -->
                      <div v-if="item.options && Object.keys(item.options).length > 0" class="mt-1">
                        <div
                            v-for="(value, key) in item.options"
                            :key="key"
                            class="text-xs text-gray-600"
                        >
                          {{ key }}: {{ value }}
                        </div>
                      </div>

                      <!-- Price -->
                      <div class="mt-2">
                        <span class="text-lg font-medium text-gray-900">
                          {{ formatPrice(getItemPrice(item)) }}
                        </span>
                        <span v-if="item.product.salePrice && item.product.salePrice < item.product.price" class="ml-2 text-sm text-gray-500 line-through">
                          {{ formatPrice(item.product.price) }}
                        </span>
                      </div>
                    </div>

                    <!-- Remove Button -->
                    <button
                        @click="removeItem(item.id)"
                        class="text-red-600 hover:text-red-800 p-1"
                        title="삭제"
                    >
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="mt-4 flex items-center justify-between">
                    <div class="flex items-center border border-gray-300 rounded-md">
                      <button
                          @click="updateQuantity(item.id, item.quantity - 1)"
                          :disabled="item.quantity <= 1"
                          class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                      >
                        <MinusIcon class="h-4 w-4" />
                      </button>
                      <input
                          :value="item.quantity"
                          @change="updateQuantity(item.id, parseInt($event.target.value))"
                          type="number"
                          min="1"
                          class="w-16 px-2 py-2 text-center border-0 focus:outline-none"
                      >
                      <button
                          @click="updateQuantity(item.id, item.quantity + 1)"
                          class="px-3 py-2 text-gray-600 hover:text-gray-800"
                      >
                        <PlusIcon class="h-4 w-4" />
                      </button>
                    </div>

                    <div class="text-lg font-medium text-gray-900">
                      {{ formatPrice(getItemTotal(item)) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bulk Actions -->
        <div class="mt-4 flex justify-between items-center">
          <button
              @click="removeSelectedItems"
              :disabled="selectedItems.length === 0"
              class="text-red-600 hover:text-red-800 disabled:text-gray-400 text-sm"
          >
            선택 상품 삭제
          </button>
          <button
              @click="clearCart"
              class="text-gray-600 hover:text-gray-800 text-sm"
          >
            장바구니 비우기
          </button>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-5 mt-8 lg:mt-0">
        <div class="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
          <h2 class="text-lg font-medium text-gray-900 mb-4">주문 요약</h2>

          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span>상품 금액</span>
              <span>{{ formatPrice(selectedItemsTotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>배송비</span>
              <span>{{ formatPrice(deliveryFee) }}</span>
            </div>
            <div class="border-t border-gray-200 pt-3">
              <div class="flex justify-between text-lg font-medium">
                <span>총 결제 금액</span>
                <span class="text-blue-600">{{ formatPrice(totalAmount) }}</span>
              </div>
            </div>
          </div>

          <button
              @click="proceedToCheckout"
              :disabled="selectedItems.length === 0"
              class="w-full mt-6 btn btn-primary py-3 text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            주문하기 ({{ selectedItems.length }}개)
          </button>

          <div class="mt-4 text-center">
            <NuxtLink
                to="/products"
                class="text-sm text-blue-600 hover:text-blue-800"
            >
              계속 쇼핑하기
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ShoppingCartIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const cartStore = useCartStore()
const authStore = useAuthStore()

const selectedItems = ref([])

// Select all functionality
const selectAll = computed({
  get() {
    return selectedItems.value.length === cartStore.items.length && cartStore.items.length > 0
  },
  set(value) {
    selectedItems.value = value ? cartStore.items.map(item => item.id) : []
  }
})

// Calculate totals for selected items
const selectedItemsTotal = computed(() => {
  return cartStore.items
      .filter(item => selectedItems.value.includes(item.id))
      .reduce((total, item) => total + getItemTotal(item), 0)
})

const deliveryFee = computed(() => {
  return selectedItemsTotal.value >= 50000 ? 0 : 3000 // Free shipping over 50,000 KRW
})

const totalAmount = computed(() => {
  return selectedItemsTotal.value + deliveryFee.value
})

// SEO
useHead({
  title: '장바구니 - BerryWeb',
  meta: [
    { name: 'description', content: '장바구니에 담은 상품들을 확인하고 주문하세요.' }
  ]
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

// Get item price
const getItemPrice = (item) => {
  return item.product.salePrice || item.product.price
}

// Get item total
const getItemTotal = (item) => {
  return getItemPrice(item) * item.quantity
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

// Update quantity
const updateQuantity = (itemId, quantity) => {
  if (quantity > 0) {
    cartStore.updateQuantity(itemId, quantity)
  }
}

// Remove item
const removeItem = (itemId) => {
  cartStore.removeItem(itemId)
  selectedItems.value = selectedItems.value.filter(id => id !== itemId)
}

// Remove selected items
const removeSelectedItems = () => {
  selectedItems.value.forEach(itemId => {
    cartStore.removeItem(itemId)
  })
  selectedItems.value = []
}

// Clear cart
const clearCart = () => {
  if (confirm('장바구니를 비우시겠습니까?')) {
    cartStore.clearCart()
    selectedItems.value = []
  }
}

// Proceed to checkout
const proceedToCheckout = () => {
  if (selectedItems.value.length === 0) return

  if (!authStore.isLoggedIn) {
    // Redirect to login with return URL
    navigateTo('/login?redirect=/checkout')
    return
  }

  // Store selected items for checkout
  const selectedCartItems = cartStore.items.filter(item =>
      selectedItems.value.includes(item.id)
  )

  // Navigate to checkout with selected items
  navigateTo('/checkout', {
    query: {
      items: selectedCartItems.map(item => item.id).join(',')
    }
  })
}

// Initialize selected items (select all by default)
onMounted(() => {
  selectedItems.value = cartStore.items.map(item => item.id)
})

// Watch for cart changes and update selected items
watch(
    () => cartStore.items,
    (newItems) => {
      // Remove selected items that are no longer in cart
      selectedItems.value = selectedItems.value.filter(id =>
          newItems.some(item => item.id === id)
      )
    },
    { deep: true }
)
</script>