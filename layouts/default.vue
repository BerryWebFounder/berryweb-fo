<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <h1 class="text-2xl font-bold text-blue-600">BerryWeb</h1>
            </NuxtLink>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-lg mx-8">
            <div class="relative">
              <input
                  v-model="searchQuery"
                  @keyup.enter="handleSearch"
                  type="text"
                  placeholder="상품을 검색하세요..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
              </div>
              <button
                  @click="handleSearch"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-600 hover:text-blue-600" />
              </button>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex items-center space-x-4">
            <!-- Cart -->
            <NuxtLink
                to="/cart"
                class="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ShoppingCartIcon class="h-6 w-6" />
              <span
                  v-if="cartStore.totalItems > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartStore.totalItems }}
              </span>
            </NuxtLink>

            <!-- User Menu -->
            <div v-if="authStore.isLoggedIn" class="relative">
              <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <UserIcon class="h-6 w-6" />
                <span class="hidden sm:block">{{ authStore.user?.username }}</span>
                <ChevronDownIcon class="h-4 w-4" />
              </button>

              <!-- Dropdown Menu -->
              <div
                  v-if="showUserMenu"
                  v-click-outside="() => showUserMenu = false"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
              >
                <div class="py-1">
                  <NuxtLink
                      to="/orders"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      @click="showUserMenu = false"
                  >
                    주문 내역
                  </NuxtLink>
                  <button
                      @click="handleLogout"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>

            <!-- Login/Register -->
            <div v-else class="flex items-center space-x-2">
              <NuxtLink
                  to="/login"
                  class="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                로그인
              </NuxtLink>
              <NuxtLink
                  to="/register"
                  class="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                회원가입
              </NuxtLink>
            </div>
          </nav>
        </div>
      </div>

      <!-- Main Navigation -->
      <div class="bg-gray-50 border-t">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex space-x-8 py-2">
            <NuxtLink
                to="/"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                :class="{ 'text-blue-600 border-b-2 border-blue-600': $route.path === '/' }"
            >
              홈
            </NuxtLink>
            <NuxtLink
                to="/shops"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                :class="{ 'text-blue-600 border-b-2 border-blue-600': $route.path.startsWith('/shops') }"
            >
              상점
            </NuxtLink>
            <NuxtLink
                to="/products"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                :class="{ 'text-blue-600 border-b-2 border-blue-600': $route.path.startsWith('/products') }"
            >
              상품
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">BerryWeb</h3>
            <p class="text-gray-300 text-sm">
              최고의 쇼핑 경험을 제공하는 온라인 마켓플레이스
            </p>
          </div>
          <div>
            <h4 class="font-medium mb-4">고객 서비스</h4>
            <ul class="space-y-2 text-sm text-gray-300">
              <li><a href="#" class="hover:text-white">고객센터</a></li>
              <li><a href="#" class="hover:text-white">배송 안내</a></li>
              <li><a href="#" class="hover:text-white">반품/교환</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-4">회사 정보</h4>
            <ul class="space-y-2 text-sm text-gray-300">
              <li><a href="#" class="hover:text-white">회사소개</a></li>
              <li><a href="#" class="hover:text-white">이용약관</a></li>
              <li><a href="#" class="hover:text-white">개인정보처리방침</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-4">연락처</h4>
            <ul class="space-y-2 text-sm text-gray-300">
              <li>고객센터: 1588-0000</li>
              <li>이메일: support@berryweb.com</li>
              <li>운영시간: 평일 9:00-18:00</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-300">
          © 2024 BerryWeb. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const cartStore = useCartStore()

const searchQuery = ref('')
const showUserMenu = ref(false)

// Initialize stores
onMounted(() => {
  authStore.initAuth()
  cartStore.initCart()
})

// Handle search
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

// Handle logout
const handleLogout = () => {
  authStore.logout()
  showUserMenu.value = false
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>