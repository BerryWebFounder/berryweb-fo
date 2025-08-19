<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="loadOrder" class="btn btn-primary">
        다시 시도
      </button>
    </div>

    <div v-else-if="order" class="space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">주문 상세</h1>
          <p class="text-gray-600 mt-1">주문번호: {{ order.orderNumber }}</p>
        </div>
        <div class="text-right">
          <div class="px-4 py-2 rounded-full text-sm font-medium"
               :class="getStatusClass(order.orderStatus)">
            {{ getStatusText(order.orderStatus) }}
          </div>
        </div>
      </div>

      <!-- Order Status Timeline -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-6">주문 진행 상황</h2>

        <div class="relative">
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div class="space-y-6">
            <div
                v-for="(step, index) in orderSteps"
                :key="step.status"
                class="relative flex items-center"
            >
              <div
                  class="flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white"
                  :class="step.completed
                  ? 'border-green-500 bg-green-500'
                  : step.current
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'"
              >
                <CheckIcon
                    v-if="step.completed"
                    class="h-4 w-4 text-white"
                />
                <div
                    v-else-if="step.current"
                    class="w-2 h-2 bg-white rounded-full"
                />
              </div>

              <div class="ml-4 flex-1">
                <h3 class="text-sm font-medium"
                    :class="step.completed || step.current ? 'text-gray-900' : 'text-gray-500'">
                  {{ step.title }}
                </h3>
                <p class="text-sm text-gray-500">{{ step.description }}</p>
                <p v-if="step.date" class="text-xs text-gray-400 mt-1">
                  {{ formatDate(step.date) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Order Items -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">주문 상품</h2>

            <div class="space-y-4">
              <div
                  v-for="item in order.orderItems"
                  :key="item.orderItemId"
                  class="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CubeIcon class="h-10 w-10 text-gray-400" />
                </div>

                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ item.productName }}</h3>
                  <p class="text-sm text-gray-600">수량: {{ item.quantity }}개</p>
                  <p class="text-sm text-gray-600">단가: {{ formatPrice(item.unitPrice) }}</p>
                  <p v-if="item.discountAmount > 0" class="text-sm text-red-600">
                    할인: -{{ formatPrice(item.discountAmount) }}
                  </p>
                </div>

                <div class="text-lg font-medium text-gray-900">
                  {{ formatPrice(item.totalPrice) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">배송 정보</h2>

            <div class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">받는 사람</dt>
                <dd class="text-sm text-gray-900">홍길동</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">연락처</dt>
                <dd class="text-sm text-gray-900">010-1234-5678</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">배송 주소</dt>
                <dd class="text-sm text-gray-900">
                  (12345) 서울특별시 강남구 테헤란로 123<br>
                  ABC빌딩 456호
                </dd>
              </div>
              <div v-if="order.notes">
                <dt class="text-sm font-medium text-gray-500">배송 요청사항</dt>
                <dd class="text-sm text-gray-900">{{ order.notes }}</dd>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">결제 정보</h2>

            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span>상품 금액</span>
                <span>{{ formatPrice(order.totalAmount) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>배송비</span>
                <span>{{ formatPrice(order.shippingAmount) }}</span>
              </div>
              <div v-if="order.discountAmount > 0" class="flex justify-between text-sm">
                <span>할인</span>
                <span class="text-red-600">-{{ formatPrice(order.discountAmount) }}</span>
              </div>
              <div v-if="order.taxAmount > 0" class="flex justify-between text-sm">
                <span>세금</span>
                <span>{{ formatPrice(order.taxAmount) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between text-lg font-medium">
                  <span>총 결제 금액</span>
                  <span class="text-blue-600">{{ formatPrice(order.finalAmount) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">주문 관리</h2>

            <div class="space-y-3">
              <button
                  v-if="canCancelOrder(order.orderStatus)"
                  @click="cancelOrder"
                  class="w-full btn bg-red-600 text-white hover:bg-red-700"
              >
                주문 취소
              </button>

              <button
                  v-if="canReorder(order.orderStatus)"
                  @click="reorder"
                  class="w-full btn btn-primary"
              >
                재주문
              </button>

              <button
                  v-if="canWriteReview(order.orderStatus)"
                  class="w-full btn btn-secondary"
              >
                리뷰 작성
              </button>

              <button
                  v-if="order.orderStatus === 'DELIVERED'"
                  class="w-full btn btn-secondary"
              >
                교환/반품 신청
              </button>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">고객센터</h2>

            <div class="space-y-3 text-sm">
              <div>
                <dt class="font-medium text-gray-700">전화번호</dt>
                <dd class="text-gray-600">1588-0000</dd>
              </div>
              <div>
                <dt class="font-medium text-gray-700">이메일</dt>
                <dd class="text-gray-600">support@berryweb.com</dd>
              </div>
              <div>
                <dt class="font-medium text-gray-700">운영시간</dt>
                <dd class="text-gray-600">평일 9:00-18:00</dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckIcon, CubeIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const orderStore = useOrderStore()
const cartStore = useCartStore()

const order = computed(() => orderStore.currentOrder)
const loading = computed(() => orderStore.loading)
const error = computed(() => orderStore.error)

// SEO
watchEffect(() => {
  if (order.value) {
    useHead({
      title: `주문 상세 - ${order.value.orderNumber} - BerryWeb`,
      meta: [
        { name: 'description', content: `주문번호 ${order.value.orderNumber}의 상세 정보를 확인하세요.` }
      ]
    })
  }
})

// Order steps for timeline
const orderSteps = computed(() => {
  if (!order.value) return []

  const steps = [
    {
      status: 'PENDING',
      title: '주문 접수',
      description: '주문이 접수되었습니다.',
      date: order.value.orderDate
    },
    {
      status: 'CONFIRMED',
      title: '결제 완료',
      description: '결제가 완료되었습니다.',
      date: order.value.orderDate
    },
    {
      status: 'PROCESSING',
      title: '상품 준비',
      description: '상품을 준비 중입니다.',
      date: null
    },
    {
      status: 'SHIPPED',
      title: '배송 시작',
      description: '상품이 배송 시작되었습니다.',
      date: order.value.shippedDate
    },
    {
      status: 'DELIVERED',
      title: '배송 완료',
      description: '상품이 배송 완료되었습니다.',
      date: order.value.deliveredDate
    }
  ]

  const currentStatus = order.value.orderStatus
  const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
  const currentIndex = statusOrder.indexOf(currentStatus)

  return steps.map((step, index) => ({
    ...step,
    completed: index < currentIndex || (currentStatus === 'DELIVERED' && index <= 4),
    current: index === currentIndex
  }))
})

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

// Get status text
const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '결제 대기',
    'CONFIRMED': '주문 확인',
    'PROCESSING': '상품 준비중',
    'SHIPPED': '배송중',
    'DELIVERED': '배송 완료',
    'CANCELLED': '주문 취소'
  }
  return statusMap[status] || status
}

// Get status class
const getStatusClass = (status) => {
  const classMap = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'CONFIRMED': 'bg-blue-100 text-blue-800',
    'PROCESSING': 'bg-purple-100 text-purple-800',
    'SHIPPED': 'bg-indigo-100 text-indigo-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// Check if order can be cancelled
const canCancelOrder = (status) => {
  return ['PENDING', 'CONFIRMED'].includes(status)
}

// Check if order can be reordered
const canReorder = (status) => {
  return ['DELIVERED', 'CANCELLED'].includes(status)
}

// Check if review can be written
const canWriteReview = (status) => {
  return status === 'DELIVERED'
}

// Cancel order
const cancelOrder = async () => {
  if (!confirm('정말로 주문을 취소하시겠습니까?')) return

  try {
    await orderStore.cancelOrder(order.value.orderId, '고객 요청')
    alert('주문이 취소되었습니다.')
  } catch (error) {
    console.error('Cancel order failed:', error)
    alert('주문 취소에 실패했습니다.')
  }
}

// Reorder
const reorder = () => {
  if (!order.value.orderItems || order.value.orderItems.length === 0) return

  // Add items to cart
  order.value.orderItems.forEach(item => {
    const product = {
      id: item.productId,
      name: item.productName,
      price: item.unitPrice,
      salePrice: item.unitPrice
    }
    cartStore.addItem(product, item.quantity)
  })

  navigateTo('/cart')
}

// Load order
const loadOrder = async () => {
  try {
    await orderStore.fetchOrder(route.params.id)
  } catch (err) {
    console.error('Failed to load order:', err)
  }
}

onMounted(() => {
  loadOrder()
})
</script>