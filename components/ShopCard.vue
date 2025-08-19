<template>
  <div class="card hover:shadow-lg transition-shadow duration-300">
    <!-- Shop Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center">
        <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {{ shopInitial }}
        </div>
        <div class="ml-3">
          <NuxtLink
              :to="`/shops/${shop.id}`"
              class="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {{ shop.name }}
          </NuxtLink>
          <div class="text-sm text-gray-500">
            {{ shop.ownerUsername }}
          </div>
        </div>
      </div>

      <!-- Status Badge -->
      <span
          v-if="shop.isActive"
          class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
      >
        운영중
      </span>
      <span
          v-else
          class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
      >
        휴업중
      </span>
    </div>

    <!-- Shop Description -->
    <p
        v-if="shop.description"
        class="text-gray-600 text-sm mb-4 line-clamp-3"
    >
      {{ shop.description }}
    </p>

    <!-- Shop Info -->
    <div class="space-y-2 mb-4">
      <!-- Business Hours -->
      <div v-if="shop.businessHours" class="flex items-center text-sm text-gray-600">
        <ClockIcon class="h-4 w-4 mr-2 flex-shrink-0" />
        <span>{{ shop.businessHours }}</span>
      </div>

      <!-- Phone -->
      <div v-if="shop.phone" class="flex items-center text-sm text-gray-600">
        <PhoneIcon class="h-4 w-4 mr-2 flex-shrink-0" />
        <span>{{ formatPhone(shop.phone) }}</span>
      </div>

      <!-- Address -->
      <div v-if="shop.address" class="flex items-center text-sm text-gray-600">
        <MapPinIcon class="h-4 w-4 mr-2 flex-shrink-0" />
        <span class="line-clamp-1">{{ shop.address }}</span>
      </div>

      <!-- Product Count -->
      <div class="flex items-center text-sm text-gray-600">
        <CubeIcon class="h-4 w-4 mr-2 flex-shrink-0" />
        <span>상품 {{ shop.productCount || 0 }}개</span>
      </div>
    </div>

    <!-- Delivery Info -->
    <div class="bg-gray-50 rounded-lg p-3 mb-4">
      <div class="text-xs text-gray-600 space-y-1">
        <div v-if="shop.minOrderAmount && shop.minOrderAmount > 0">
          최소 주문금액: {{ formatPrice(shop.minOrderAmount) }}
        </div>
        <div v-if="shop.deliveryFee">
          배송비: {{ formatPrice(shop.deliveryFee) }}
        </div>
        <div v-if="shop.freeDeliveryAmount">
          무료배송: {{ formatPrice(shop.freeDeliveryAmount) }} 이상
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <NuxtLink
          :to="`/shops/${shop.id}`"
          class="flex-1 btn btn-primary text-center"
      >
        상점 방문
      </NuxtLink>
      <NuxtLink
          :to="`/shops/${shop.id}/products`"
          class="btn btn-secondary px-3"
          title="상품 보기"
      >
        <CubeIcon class="h-4 w-4" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import {
  ClockIcon,
  PhoneIcon,
  MapPinIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  shop: {
    type: Object,
    required: true
  }
})

// Shop initial letter
const shopInitial = computed(() => {
  return props.shop.name?.charAt(0)?.toUpperCase() || 'S'
})

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

// Format phone number
const formatPhone = (phone) => {
  if (!phone) return ''

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')

  // Format as XXX-XXXX-XXXX or XXX-XXX-XXXX
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return phone
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>