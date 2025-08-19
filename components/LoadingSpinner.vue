<template>
  <div
      :class="[
      'flex items-center justify-center',
      overlay && 'fixed inset-0 bg-black bg-opacity-50 z-50',
      fullHeight && 'min-h-screen',
      className
    ]"
  >
    <div class="flex flex-col items-center space-y-4">
      <!-- Spinner -->
      <div
          :class="[
          'animate-spin rounded-full border-4 border-solid border-current border-r-transparent',
          sizeClasses[size],
          colorClasses[color]
        ]"
          role="status"
          aria-label="로딩 중"
      >
        <span class="sr-only">로딩 중...</span>
      </div>

      <!-- Loading Text -->
      <div
          v-if="text"
          :class="[
          'text-center font-medium',
          textSizeClasses[size],
          textColorClasses[color]
        ]"
      >
        {{ text }}
      </div>

      <!-- Progress Bar -->
      <div
          v-if="showProgress && progress !== null"
          class="w-64 bg-gray-200 rounded-full h-2"
      >
        <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
        ></div>
        <div class="text-xs text-gray-600 text-center mt-1">
          {{ Math.round(progress) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // Size of the spinner
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },

  // Color theme
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error', 'white'].includes(value)
  },

  // Loading text
  text: {
    type: String,
    default: ''
  },

  // Show as overlay
  overlay: {
    type: Boolean,
    default: false
  },

  // Full height container
  fullHeight: {
    type: Boolean,
    default: false
  },

  // Show progress bar
  showProgress: {
    type: Boolean,
    default: false
  },

  // Progress value (0-100)
  progress: {
    type: Number,
    default: null
  },

  // Additional CSS classes
  className: {
    type: String,
    default: ''
  }
})

// Size classes for spinner
const sizeClasses = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

// Text size classes
const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}

// Color classes for spinner
const colorClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  white: 'text-white'
}

// Text color classes
const textColorClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  white: 'text-white'
}
</script>