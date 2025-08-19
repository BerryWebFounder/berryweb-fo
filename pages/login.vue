<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1 class="text-center text-3xl font-bold text-blue-600 mb-2">BerryWeb</h1>
        <h2 class="text-center text-2xl font-bold text-gray-900">
          로그인
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          계정이 없으신가요?
          <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            회원가입
          </NuxtLink>
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              아이디
            </label>
            <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="mt-1 input"
                placeholder="아이디를 입력하세요"
                :disabled="loading"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <div class="mt-1 relative">
              <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="input pr-10"
                  placeholder="비밀번호를 입력하세요"
                  :disabled="loading"
              >
              <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
                id="remember-me"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              로그인 상태 유지
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div>
          <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">로그인 중...</span>
            <span v-else>로그인</span>
          </button>
        </div>

        <!-- Social Login -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">또는</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
                type="button"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="text-yellow-400 font-bold">K</span>
              <span class="ml-1">카카오</span>
            </button>

            <button
                type="button"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="text-green-500 font-bold">N</span>
              <span class="ml-1">네이버</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const route = useRoute()

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// SEO
useHead({
  title: '로그인 - BerryWeb',
  meta: [
    { name: 'description', content: 'BerryWeb에 로그인하여 다양한 서비스를 이용하세요.' }
  ]
})

// Redirect if already logged in
watch(() => authStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    const redirectTo = route.query.redirect || '/'
    navigateTo(redirectTo)
  }
}, { immediate: true })

// Handle login
const handleLogin = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''

    const result = await authStore.login({
      username: form.username,
      password: form.password,
      remember: form.remember
    })

    if (result.success) {
      const redirectTo = route.query.redirect || '/'
      navigateTo(redirectTo)
    } else {
      error.value = result.error || '로그인에 실패했습니다.'
    }
  } catch (err) {
    error.value = '로그인 중 오류가 발생했습니다.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

// Demo credentials helper
onMounted(() => {
  // Pre-fill demo credentials for testing
  if (process.dev) {
    form.username = 'demo'
    form.password = 'demo123'
  }
})
</script>