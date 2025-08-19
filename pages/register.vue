<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1 class="text-center text-3xl font-bold text-blue-600 mb-2">BerryWeb</h1>
        <h2 class="text-center text-2xl font-bold text-gray-900">
          회원가입
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            로그인
          </NuxtLink>
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              아이디 *
            </label>
            <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="mt-1 input"
                placeholder="아이디를 입력하세요 (4-20자)"
                :disabled="loading"
                @blur="checkUsername"
            >
            <p v-if="usernameError" class="mt-1 text-sm text-red-600">{{ usernameError }}</p>
            <p v-else-if="usernameValid" class="mt-1 text-sm text-green-600">사용 가능한 아이디입니다.</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              이메일 *
            </label>
            <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="mt-1 input"
                placeholder="이메일을 입력하세요"
                :disabled="loading"
                @blur="checkEmail"
            >
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
            <p v-else-if="emailValid" class="mt-1 text-sm text-green-600">사용 가능한 이메일입니다.</p>
          </div>

          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              이름 *
            </label>
            <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="mt-1 input"
                placeholder="이름을 입력하세요"
                :disabled="loading"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              비밀번호 *
            </label>
            <div class="mt-1 relative">
              <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="input pr-10"
                  placeholder="비밀번호를 입력하세요 (8자 이상)"
                  :disabled="loading"
                  @input="checkPasswordStrength"
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

            <!-- Password Strength Indicator -->
            <div v-if="form.password" class="mt-2">
              <div class="flex space-x-1">
                <div
                    v-for="i in 4"
                    :key="i"
                    class="h-1 flex-1 rounded"
                    :class="getPasswordStrengthColor(i)"
                ></div>
              </div>
              <p class="mt-1 text-xs" :class="passwordStrengthClass">
                {{ passwordStrengthText }}
              </p>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              비밀번호 확인 *
            </label>
            <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="mt-1 input pr-10"
                placeholder="비밀번호를 다시 입력하세요"
                :disabled="loading"
            >
            <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5 text-gray-400" />
              <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
            </button>
            <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="mt-1 text-sm text-red-600">
              비밀번호가 일치하지 않습니다.
            </p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              휴대폰 번호
            </label>
            <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="mt-1 input"
                placeholder="010-1234-5678"
                :disabled="loading"
            >
          </div>
        </div>

        <!-- Terms Agreement -->
        <div class="space-y-3">
          <div class="flex items-start">
            <input
                id="agreeAll"
                v-model="agreeAll"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
            >
            <label for="agreeAll" class="ml-2 block text-sm font-medium text-gray-900">
              전체 동의
            </label>
          </div>

          <div class="pl-6 space-y-2">
            <div class="flex items-start">
              <input
                  id="agreeTerms"
                  v-model="agreements.terms"
                  type="checkbox"
                  required
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              >
              <label for="agreeTerms" class="ml-2 block text-sm text-gray-700">
                <span class="text-red-500">*</span>
                <a href="#" class="text-blue-600 hover:text-blue-800">이용약관</a>에 동의합니다
              </label>
            </div>

            <div class="flex items-start">
              <input
                  id="agreePrivacy"
                  v-model="agreements.privacy"
                  type="checkbox"
                  required
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              >
              <label for="agreePrivacy" class="ml-2 block text-sm text-gray-700">
                <span class="text-red-500">*</span>
                <a href="#" class="text-blue-600 hover:text-blue-800">개인정보처리방침</a>에 동의합니다
              </label>
            </div>

            <div class="flex items-start">
              <input
                  id="agreeMarketing"
                  v-model="agreements.marketing"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              >
              <label for="agreeMarketing" class="ml-2 block text-sm text-gray-700">
                마케팅 정보 수신에 동의합니다 (선택)
              </label>
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div>
          <button
              type="submit"
              :disabled="!canRegister || loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">가입 중...</span>
            <span v-else>회원가입</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const form = reactive({
  username: '',
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
  phone: ''
})

const agreements = reactive({
  terms: false,
  privacy: false,
  marketing: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')

const usernameError = ref('')
const usernameValid = ref(false)
const emailError = ref('')
const emailValid = ref(false)
const passwordStrength = ref(0)

// SEO
useHead({
  title: '회원가입 - BerryWeb',
  meta: [
    { name: 'description', content: 'BerryWeb에 가입하여 다양한 혜택을 누리세요.' }
  ]
})

// Agree all toggle
const agreeAll = computed({
  get() {
    return agreements.terms && agreements.privacy && agreements.marketing
  },
  set(value) {
    agreements.terms = value
    agreements.privacy = value
    agreements.marketing = value
  }
})

// Can register check
const canRegister = computed(() => {
  return form.username &&
      form.email &&
      form.name &&
      form.password &&
      form.password === form.confirmPassword &&
      form.password.length >= 8 &&
      agreements.terms &&
      agreements.privacy &&
      usernameValid.value &&
      emailValid.value
})

// Password strength calculation
const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return ''
  if (strength === 1) return '매우 약함'
  if (strength === 2) return '약함'
  if (strength === 3) return '보통'
  return '강함'
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'text-red-600'
  if (strength === 2) return 'text-yellow-600'
  if (strength === 3) return 'text-blue-600'
  return 'text-green-600'
})

// Check username availability
const checkUsername = () => {
  usernameError.value = ''
  usernameValid.value = false

  if (!form.username) return

  if (form.username.length < 4 || form.username.length > 20) {
    usernameError.value = '아이디는 4-20자 사이여야 합니다.'
    return
  }

  if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    usernameError.value = '아이디는 영문, 숫자, 밑줄(_)만 사용 가능합니다.'
    return
  }

  // Mock validation - in real app, this would be an API call
  const reservedUsernames = ['admin', 'root', 'test', 'demo']
  if (reservedUsernames.includes(form.username.toLowerCase())) {
    usernameError.value = '사용할 수 없는 아이디입니다.'
    return
  }

  usernameValid.value = true
}

// Check email availability
const checkEmail = () => {
  emailError.value = ''
  emailValid.value = false

  if (!form.email) return

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    emailError.value = '올바른 이메일 형식이 아닙니다.'
    return
  }

  // Mock validation - in real app, this would be an API call
  const reservedEmails = ['admin@example.com', 'test@example.com']
  if (reservedEmails.includes(form.email.toLowerCase())) {
    emailError.value = '이미 사용 중인 이메일입니다.'
    return
  }

  emailValid.value = true
}

// Check password strength
const checkPasswordStrength = () => {
  const password = form.password
  let strength = 0

  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  passwordStrength.value = Math.min(strength, 4)
}

// Get password strength indicator color
const getPasswordStrengthColor = (index) => {
  const strength = passwordStrength.value
  if (index <= strength) {
    if (strength <= 1) return 'bg-red-500'
    if (strength === 2) return 'bg-yellow-500'
    if (strength === 3) return 'bg-blue-500'
    return 'bg-green-500'
  }
  return 'bg-gray-200'
}

// Handle registration
const handleRegister = async () => {
  if (!canRegister.value || loading.value) return

  try {
    loading.value = true
    error.value = ''

    const result = await authStore.register({
      username: form.username,
      email: form.email,
      name: form.name,
      password: form.password,
      phone: form.phone,
      agreements: agreements
    })

    if (result.success) {
      navigateTo('/')
    } else {
      error.value = result.error || '회원가입에 실패했습니다.'
    }
  } catch (err) {
    error.value = '회원가입 중 오류가 발생했습니다.'
    console.error('Register error:', err)
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
watch(() => authStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    navigateTo('/')
  }
}, { immediate: true })
</script>