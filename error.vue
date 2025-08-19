<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <!-- Error Icon -->
      <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-8">
        <ExclamationTriangleIcon class="h-12 w-12 text-red-600" />
      </div>

      <!-- Error Code -->
      <h1 class="text-6xl font-bold text-gray-900 mb-4">
        {{ error.statusCode || '오류' }}
      </h1>

      <!-- Error Message -->
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">
        {{ getErrorTitle() }}
      </h2>

      <p class="text-gray-600 mb-8">
        {{ getErrorMessage() }}
      </p>

      <!-- Action Buttons -->
      <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
        <button
            @click="handleRetry"
            class="w-full sm:w-auto btn btn-primary"
        >
          다시 시도
        </button>

        <NuxtLink
            to="/"
            class="w-full sm:w-auto btn btn-secondary"
        >
          홈으로 돌아가기
        </NuxtLink>
      </div>

      <!-- Additional Help -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 mb-4">도움이 필요하신가요?</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-center justify-center">
            <PhoneIcon class="h-4 w-4 mr-2" />
            <span>고객센터: 1588-0000</span>
          </div>
          <div class="flex items-center justify-center">
            <EnvelopeIcon class="h-4 w-4 mr-2" />
            <span>이메일: support@berryweb.com</span>
          </div>
          <div class="flex items-center justify-center">
            <ClockIcon class="h-4 w-4 mr-2" />
            <span>운영시간: 평일 9:00-18:00</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

// Set page title
useHead({
  title: `오류 ${props.error.statusCode || ''} - BerryWeb`
})

// Get error title based on status code
const getErrorTitle = () => {
  const statusCode = props.error.statusCode

  switch (statusCode) {
    case 404:
      return '페이지를 찾을 수 없습니다'
    case 403:
      return '접근이 거부되었습니다'
    case 401:
      return '로그인이 필요합니다'
    case 500:
      return '서버 오류가 발생했습니다'
    case 503:
      return '서비스를 사용할 수 없습니다'
    default:
      return '오류가 발생했습니다'
  }
}

// Get error message based on status code
const getErrorMessage = () => {
  const statusCode = props.error.statusCode

  switch (statusCode) {
    case 404:
      return '요청하신 페이지를 찾을 수 없습니다. URL을 확인해주세요.'
    case 403:
      return '이 페이지에 접근할 권한이 없습니다.'
    case 401:
      return '로그인 후 다시 시도해주세요.'
    case 500:
      return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
    case 503:
      return '현재 서비스가 점검 중입니다. 잠시 후 다시 시도해주세요.'
    default:
      return props.error.message || '알 수 없는 오류가 발생했습니다.'
  }
}

// Handle retry
const handleRetry = () => {
  if (props.error.statusCode === 404) {
    // For 404 errors, go to home page
    navigateTo('/')
  } else {
    // For other errors, try to reload the page
    window.location.reload()
  }
}

// Log error for debugging
if (process.client) {
  console.error('Error occurred:', props.error)
}
</script>