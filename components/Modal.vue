<template>
  <Teleport to="body">
    <Transition
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-if="isOpen"
          class="fixed inset-0 z-50 overflow-y-auto"
          @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <Transition
              enter-active-class="duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
                v-if="isOpen"
                :class="[
                'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all',
                sizeClasses[size]
              ]"
                @click.stop
            >
              <!-- Header -->
              <div
                  v-if="title || $slots.header || showCloseButton"
                  :class="[
                  'flex items-center justify-between px-6 py-4',
                  headerClass
                ]"
              >
                <div class="flex-1">
                  <slot name="header">
                    <h3
                        v-if="title"
                        class="text-lg font-semibold text-gray-900"
                    >
                      {{ title }}
                    </h3>
                  </slot>
                </div>

                <button
                    v-if="showCloseButton"
                    @click="close"
                    class="ml-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span class="sr-only">닫기</span>
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Body -->
              <div :class="['px-6 py-4', bodyClass]">
                <slot></slot>
              </div>

              <!-- Footer -->
              <div
                  v-if="$slots.footer || (showCancelButton || showConfirmButton)"
                  :class="[
                  'flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50',
                  footerClass
                ]"
              >
                <slot name="footer">
                  <button
                      v-if="showCancelButton"
                      @click="cancel"
                      :disabled="loading"
                      class="btn btn-secondary"
                  >
                    {{ cancelText }}
                  </button>
                  <button
                      v-if="showConfirmButton"
                      @click="confirm"
                      :disabled="loading"
                      :class="[
                      'btn',
                      confirmButtonType === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' : 'btn-primary'
                    ]"
                  >
                    <LoadingSpinner
                        v-if="loading"
                        size="xs"
                        color="white"
                        class="mr-2"
                    />
                    {{ confirmText }}
                  </button>
                </slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  // Modal visibility
  modelValue: {
    type: Boolean,
    default: false
  },

  // Modal title
  title: {
    type: String,
    default: ''
  },

  // Modal size
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'].includes(value)
  },

  // Close on backdrop click
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },

  // Show close button
  showCloseButton: {
    type: Boolean,
    default: true
  },

  // Show cancel button
  showCancelButton: {
    type: Boolean,
    default: false
  },

  // Show confirm button
  showConfirmButton: {
    type: Boolean,
    default: false
  },

  // Button texts
  cancelText: {
    type: String,
    default: '취소'
  },

  confirmText: {
    type: String,
    default: '확인'
  },

  // Confirm button type
  confirmButtonType: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger'].includes(value)
  },

  // Loading state
  loading: {
    type: Boolean,
    default: false
  },

  // Custom classes
  headerClass: {
    type: String,
    default: ''
  },

  bodyClass: {
    type: String,
    default: ''
  },

  footerClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:modelValue',
  'close',
  'cancel',
  'confirm'
])

// Computed for modal visibility
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Size classes
const sizeClasses = {
  xs: 'sm:max-w-xs sm:w-full',
  sm: 'sm:max-w-sm sm:w-full',
  md: 'sm:max-w-md sm:w-full',
  lg: 'sm:max-w-lg sm:w-full',
  xl: 'sm:max-w-xl sm:w-full',
  '2xl': 'sm:max-w-2xl sm:w-full',
  '3xl': 'sm:max-w-3xl sm:w-full',
  '4xl': 'sm:max-w-4xl sm:w-full',
  full: 'sm:max-w-full sm:w-full sm:h-full sm:m-0'
}

// Handle backdrop click
const handleBackdropClick = (event) => {
  if (props.closeOnBackdrop && event.target === event.currentTarget) {
    close()
  }
}

// Close modal
const close = () => {
  isOpen.value = false
  emit('close')
}

// Cancel action
const cancel = () => {
  emit('cancel')
  close()
}

// Confirm action
const confirm = () => {
  emit('confirm')
}

// Handle escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    close()
  }
}

// Lock body scroll when modal is open
watch(isOpen, (newValue) => {
  if (process.client) {
    if (newValue) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleEscape)
  }
})
</script>