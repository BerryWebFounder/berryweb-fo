<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">주문/결제</h1>

    <div v-if="!authStore.isLoggedIn" class="text-center py-16">
      <p class="text-gray-600 mb-4">로그인이 필요한 서비스입니다.</p>
      <NuxtLink to="/login" class="btn btn-primary">
        로그인하기
      </NuxtLink>
    </div>

    <div v-else-if="checkoutItems.length === 0" class="text-center py-16">
      <p class="text-gray-600 mb-4">주문할 상품이 없습니다.</p>
      <NuxtLink to="/cart" class="btn btn-primary">
        장바구니로 돌아가기
      </NuxtLink>
    </div>

    <div v-else class="lg:grid lg:grid-cols-12 lg:gap-x-12">
      <!-- Order Form -->
      <div class="lg:col-span-7 space-y-8">
        <!-- Shipping Address -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">배송 정보</h2>

          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                받는 사람 *
              </label>
              <input
                  v-model="orderForm.recipientName"
                  type="text"
                  required
                  class="input"
                  placeholder="받는 사람 이름을 입력하세요"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                연락처 *
              </label>
              <input
                  v-model="orderForm.recipientPhone"
                  type="tel"
                  required
                  class="input"
                  placeholder="010-1234-5678"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                주소 *
              </label>
              <div class="space-y-2">
                <div class="flex gap-2">
                  <input
                      v-model="orderForm.zipCode"
                      type="text"
                      placeholder="우편번호"
                      class="input w-32"
                      readonly
                  >
                  <button
                      @click="openAddressSearch"
                      class="btn btn-secondary"
                  >
                    주소 검색
                  </button>
                </div>
                <input
                    v-model="orderForm.address"
                    type="text"
                    placeholder="기본 주소"
                    class="input"
                    readonly
                >
                <input
                    v-model="orderForm.detailAddress"
                    type="text"
                    placeholder="상세 주소를 입력하세요"
                    class="input"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                배송 요청사항
              </label>
              <select v-model="orderForm.deliveryRequest" class="input">
                <option value="">배송 요청사항을 선택하세요</option>
                <option value="door">문 앞에 놓아주세요</option>
                <option value="security">경비실에 맡겨주세요</option>
                <option value="call">배송 전 연락주세요</option>
                <option value="custom">직접 입력</option>
              </select>
              <input
                  v-if="orderForm.deliveryRequest === 'custom'"
                  v-model="orderForm.customDeliveryRequest"
                  type="text"
                  placeholder="배송 요청사항을 입력하세요"
                  class="input mt-2"
              >
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">결제 수단</h2>

          <div class="space-y-3">
            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                  v-model="orderForm.paymentMethod"
                  type="radio"
                  value="card"
                  class="mr-3"
              >
              <CreditCardIcon class="h-5 w-5 mr-2" />
              <span>신용카드</span>
            </label>

            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                  v-model="orderForm.paymentMethod"
                  type="radio"
                  value="bank"
                  class="mr-3"
              >
              <BanknotesIcon class="h-5 w-5 mr-2" />
              <span>계좌이체</span>
            </label>

            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                  v-model="orderForm.paymentMethod"
                  type="radio"
                  value="kakao"
                  class="mr-3"
              >
              <DevicePhoneMobileIcon class="h-5 w-5 mr-2" />
              <span>카카오페이</span>
            </label>

            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                  v-model="orderForm.paymentMethod"
                  type="radio"
                  value="naver"
                  class="mr-3"
              >
              <DevicePhoneMobileIcon class="h-5 w-5 mr-2" />
              <span>네이버페이</span>
            </label>
          </div>
        </div>

        <!-- Order Notes -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">주문 메모</h2>
          <textarea
              v-model="orderForm.notes"
              rows="3"
              class="input"
              placeholder="주문에 대한 요청사항이 있으시면 입력해주세요"
          ></textarea>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-5 mt-8 lg:mt-0">
        <div class="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
          <h2 class="text-lg font-medium text-gray-900 mb-4">주문 상품</h2>

          <!-- Order Items -->
          <div class="space-y-3 mb-6">
            <div
                v-for="item in checkoutItems"
                :key="item.id"
                class="flex items-center space-x-3"
            >
              <img
                  :src="getProductImage(item.product)"
                  :alt="item.product.name"
                  class="w-12 h-12 rounded-lg object-cover"
                  @error="handleImageError"
              >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ item.product.name }}
                </p>
                <p class="text-sm text-gray-600">
                  수량: {{ item.quantity }}개
                </p>
              </div>
              <div class="text-sm font-medium text-gray-900">
                {{ formatPrice(getItemTotal(item)) }}
              </div>
            </div>
          </div>

          <!-- Price Breakdown -->
          <div class="space-y-3 border-t pt-4">
            <div class="flex justify-between text-sm">
              <span>상품 금액</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>배송비</span>
              <span>{{ formatPrice(deliveryFee) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>할인</span>
              <span class="text-red-600">-{{ formatPrice(discount) }}</span>
            </div>
            <div class="border-t border-gray-200 pt-3">
              <div class="flex justify-between text-lg font-medium">
                <span>총 결제 금액</span>
                <span class="text-blue-600">{{ formatPrice(totalAmount) }}</span>
              </div>
            </div>
          </div>

          <!-- Agreement -->
          <div class="mt-6 space-y-3">
            <label class="flex items-start">
              <input
                  v-model="agreements.terms"
                  type="checkbox"
                  class="mt-1 rounded border-gray-300 text-blue-600"
              >
              <span class="ml-2 text-sm text-gray-700">
                <a href="#" class="text-blue-600 hover:text-blue-800">이용약관</a> 및
                <a href="#" class="text-blue-600 hover:text-blue-800">개인정보처리방침</a>에 동의합니다.
              </span>
            </label>

            <label class="flex items-start">
              <input
                  v-model="agreements.payment"
                  type="checkbox"
                  class="mt-1 rounded border-gray-300 text-blue-600"
              >
              <span class="ml-2 text-sm text-gray-700">
                결제 정보 제공에 동의합니다.
              </span>
            </label>
          </div>

          <!-- Place Order Button -->
          <button
              @click="placeOrder"
              :disabled="!canPlaceOrder || loading"
              class="w-full mt-6 btn btn-primary py-3 text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span v-if="loading">처리 중...</span>
            <span v-else>{{ formatPrice(totalAmount) }} 결제하기</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const loading = ref(false)

// Order form data
const orderForm = reactive({
  recipientName: '',
  recipientPhone: '',
  zipCode: '',
  address: '',
  detailAddress: '',
  deliveryRequest: '',
  customDeliveryRequest: '',
  paymentMethod: 'card',
  notes: ''
})

// Agreements
const agreements = reactive({
  terms: false,
  payment: false
})

// Get checkout items from cart based on query params
const checkoutItems = computed(() => {
  const itemIds = route.query.items?.split(',') || []
  return cartStore.items.filter(item => itemIds.includes(item.id))
})

// Price calculations
const subtotal = computed(() => {
  return checkoutItems.value.reduce((total, item) => total + getItemTotal(item), 0)
})

const deliveryFee = computed(() => {
  return subtotal.value >= 50000 ? 0 : 3000
})

const discount = computed(() => {
  // TODO: Implement discount calculation
  return 0
})

const totalAmount = computed(() => {
  return subtotal.value + deliveryFee.value - discount.value
})

// Validation
const canPlaceOrder = computed(() => {
  return orderForm.recipientName &&
      orderForm.recipientPhone &&
      orderForm.address &&
      orderForm.paymentMethod &&
      agreements.terms &&
      agreements.payment &&
      checkoutItems.value.length > 0
})

// SEO
useHead({
  title: '주문/결제 - BerryWeb',
  meta: [
    { name: 'description', content: '안전하고 편리한 주문/결제 서비스를 이용하세요.' }
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

// Get item total
const getItemTotal = (item) => {
  const price = item.product.salePrice || item.product.price
  return price * item.quantity
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

// Open address search (Daum Postcode API integration would go here)
const openAddressSearch = () => {
  // TODO: Integrate with Daum Postcode API
  alert('주소 검색 기능은 추후 구현 예정입니다.')
}

// Place order
const placeOrder = async () => {
  if (!canPlaceOrder.value) return

  try {
    loading.value = true

    // Create order
    const orderData = {
      shippingAddressId: null, // Mock data - would be actual address ID
      billingAddressId: null,
      discountAmount: discount.value,
      shippingAmount: deliveryFee.value,
      taxAmount: 0,
      notes: orderForm.notes,
      orderItems: checkoutItems.value
    }

    const order = await orderStore.createOrder(orderData)

    // Create payment
    const paymentData = {
      paymentMethodId: getPaymentMethodId(orderForm.paymentMethod),
      paymentAmount: totalAmount.value,
      paymentGateway: orderForm.paymentMethod.toUpperCase(),
      transactionId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    const payment = await orderStore.createPayment(order.orderId, paymentData)

    // Process payment (mock success)
    await orderStore.processPayment(payment.paymentId, 'SUCCESS')

    // Remove checkout items from cart
    checkoutItems.value.forEach(item => {
      cartStore.removeItem(item.id)
    })

    // Redirect to order confirmation
    navigateTo(`/orders/${order.orderId}`)

  } catch (error) {
    console.error('Order failed:', error)
    alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
  } finally {
    loading.value = false
  }
}

// Get payment method ID (mock data)
const getPaymentMethodId = (method) => {
  const methodMap = {
    card: 1,
    bank: 2,
    kakao: 3,
    naver: 4
  }
  return methodMap[method] || 1
}

// Initialize form with user data
onMounted(() => {
  if (authStore.user) {
    orderForm.recipientName = authStore.user.name || authStore.user.username
    // TODO: Load saved addresses
  }

  // Redirect if no items selected
  if (checkoutItems.value.length === 0) {
    navigateTo('/cart')
  }
})
</script>