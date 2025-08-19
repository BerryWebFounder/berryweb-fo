<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">주문 내역</h1>
      <div class="text-sm text-gray-600">
        총 {{ orders.length }}건
      </div>
    </div>

    <div v-if="!authStore.isLoggedIn" class="text-center py-16">
      <p class="text-gray-600 mb-4">로그인이 필요한 서비스입니다.</p>
      <NuxtLink to="/login" class="btn btn-primary">
        로그인하기
      </NuxtLink>
    </div>

    <div v-else-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="loadOrders" class="btn btn-primary">
        다시 시도
      </button>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-16">
      <ShoppingBagIcon class="h-24 w-24 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-medium text-gray-900 mb-2">주문 내역이 없습니다</h2>
      <p class="text-gray-600 mb-6">첫 주문을 시작해보세요!</p>
      <NuxtLink to="/products" class="btn btn-primary">
        상품 둘러보기
      </NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <!-- Filter Tabs -->
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="flex space-x-4 overflow-x-auto">
          <button
              v-for="status in orderStatuses"
              :key="status.value"
              @click="selectedStatus = status.value"
              class="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-colors"
              :class="selectedStatus === status.value
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <!-- Order List -->
      <div class="space-y-4">
        <div
            v-for="order in filteredOrders"
            :key="order.orderId"
            class="bg-white rounded-lg shadow-sm border overflow-hidden"
        >
          <!-- Order Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">
                    주문번호: {{ order.orderNumber }}
                  </h3>
                  <p class="text-sm text-gray-600">
                    주문일시: {{ formatDate(order.orderDate) }}
                  </p>
                </div>
                <div class="px-3 py-1 rounded-full text-xs font-medium"
                     :class="getStatusClass(order.orderStatus)">
                  {{ getStatusText(order.orderStatus) }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">
                  {{ formatPrice(order.finalAmount) }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ order.orderItems?.length || 0 }}개 상품
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="px-6 py-4">
            <div v-if="order.orderItems && order.orderItems.length > 0" class="space-y-3">
              <div
                  v-for="item in order.orderItems.slice(0, 3)"
                  :key="item.orderItemId"
                  class="flex items-center space-x-3"
              >
                <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CubeIcon class="h-8 w-8 text-gray-400" />
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900">
                    {{ item.productName }}
                  </h4>
                  <p class="text-sm text-gray-600">
                    수량: {{ item.quantity }}개 × {{ formatPrice(item.unitPrice) }}
                  </p>
                </div>
                <div class="text-sm font-medium text-gray-900">
                  {{ formatPrice(item.totalPrice) }}
                </div>
              </div>

              <!-- Show more items indicator -->
              <div v-if="order.orderItems.length > 3" class="text-center">
                <span class="text-sm text-gray-500">
                  외 {{ order.orderItems.length - 3 }}개 상품
                </span>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex space-x-3">
                <NuxtLink
                    :to="`/orders/${order.orderId}`"
                    class="btn btn-secondary text-sm"
                >
                  주문 상세
                </NuxtLink>

                <button
                    v-if="canCancelOrder(order.orderStatus)"
                    @click="cancelOrder(order.orderId)"
                    class="btn bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  주문 취소
                </button>

                <button
                    v-if="canReorder(order.orderStatus)"
                    @click="reorder(order)"
                    class="btn btn-primary text-sm"
                >
                  재주문
                </button>
              </div>

              <div class="flex space-x-3">
                <button
                    v-if="canWriteReview(order.orderStatus)"
                    class="text-sm text-blue-600 hover:text-blue-800"
                >
                  리뷰 작성
                </button>

                <button
                    v-if="order.orderStatus === 'DELIVERED'"
                    class="text-sm text-green-600 hover:text-green-800"
                >
                  교환/반품
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex space-x-2">
          <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="currentPage === page
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShoppingBagIcon, CubeIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const orderStore = useOrderStore()
const cartStore = useCartStore()

const orders = ref([])
const loading = computed(() => orderStore.loading)
const error = computed(() => orderStore.error)

const selectedStatus = ref('ALL')
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)

// SEO
useHead({
  title: '주문 내역 - BerryWeb',
  meta: [
    { name: 'description', content: '나의 주문 내역을 확인하고 관리하세요.' }
  ]
})

// Order statuses for filtering
const orderStatuses = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '결제 대기' },
  { value: 'CONFIRMED', label: '주문 확인' },
  { value: 'PROCESSING', label: '상품 준비중' },
  { value: 'SHIPPED', label: '배송중' },
  { value: 'DELIVERED', label: '배송 완료' },
  { value: 'CANCELLED', label: '주문 취소' }
]

// Filtered orders
const filteredOrders = computed(() => {
  if (selectedStatus.value === 'ALL') {
    return orders.value
  }
  return orders.value.filter(order => order.orderStatus === selectedStatus.value)
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
const cancelOrder = async (orderId) => {
  if (!confirm('정말로 주문을 취소하시겠습니까?')) return

  try {
    await orderStore.cancelOrder(orderId, '고객 요청')
    await loadOrders() // Reload orders
    alert('주문이 취소되었습니다.')
  } catch (error) {
    console.error('Cancel order failed:', error)
    alert('주문 취소에 실패했습니다.')
  }
}

// Reorder
const reorder = (order) => {
  if (!order.orderItems || order.orderItems.length === 0) return

  // Add items to cart
  order.orderItems.forEach(item => {
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

// Load orders
const loadOrders = async () => {
  if (!authStore.isLoggedIn) return

  try {
    const response = await orderStore.fetchCustomerOrders(currentPage.value - 1, pageSize.value)
    orders.value = response.content || []
    totalPages.value = response.totalPages || 1
  } catch (err) {
    console.error('Failed to load orders:', err)
  }
}

// Watch for page changes
watch(currentPage, () => {
  loadOrders()
})

// Watch for auth state
watch(() => authStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    loadOrders()
  }
}, { immediate: true })

// Load orders on mount
onMounted(() => {
  if (authStore.isLoggedIn) {
    loadOrders()
  }
})
</script>