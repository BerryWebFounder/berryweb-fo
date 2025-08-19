<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Transition
          v-for="toast in toasts"
          :key="toast.id"
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div
            :class="[
            'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
            toast.className
          ]"
        >
          <div class="p-4">
            <div class="flex items-start">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <CheckCircleIcon
                    v-if="toast.type === 'success'"
                    class="h-6 w-6 text-green-400"
                    aria-hidden="true"
                />
                <ExclamationTriangleIcon
                    v-else-if="toast.type === 'warning'"
                    class="h-6 w-6 text-yellow-400"
                    aria-hidden="true"
                />
                <XCircleIcon
                    v-else-if="toast.type === 'error'"
                    class="h-6 w-6 text-red-400"
                    aria-hidden="true"
                />
                <InformationCircleIcon
                    v-else
                    class="h-6 w-6 text-blue-400"
                    aria-hidden="true"
                />
              </div>

              <!-- Content -->
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p
                    v-if="toast.title"
                    class="text-sm font-medium text-gray-900"
                >
                  {{ toast.title }}
                </p>
                <p
                    :class="[
                    'text-sm text-gray-500',
                    toast.title && 'mt-1'
                  ]"
                >
                  {{ toast.message }}
                </p>

                <!-- Actions -->
                <div
                    v-if="toast.actions && toast.actions.length"
                    class="mt-3 flex space-x-3"
                >
                  <button
                      v-for="action in toast.actions"
                      :key="action.label"
                      @click="handleAction(toast, action)"
                      :class="[
                      'text-sm font-medium',
                      action.primary
                        ? 'text-blue-600 hover:text-blue-500'
                        : 'text-gray-700 hover:text-gray-500'
                    ]"
                  >
                    {{ action.label }}
                  </button>
                </div>
              </div>

              <!-- Close button -->
              <div class="ml-4 flex-shrink-0 flex">
                <button
                    @click="removeToast(toast.id)"
                    class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <!-- Progress bar -->
          <div
              v-if="toast.duration && toast.progress !== undefined"
              class="h-1 bg-gray-200"
          >
            <div
                :class="[
                'h-full transition-all ease-linear',
                toast.type === 'success' && 'bg-green-400',
                toast.type === 'warning' && 'bg-yellow-400',
                toast.type === 'error' && 'bg-red-400',
                (!toast.type || toast.type === 'info') && 'bg-blue-400'
              ]"
                :style="{ width: `${100 - toast.progress}%` }"
            ></div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Toast store
const toasts = ref([])
let toastIdCounter = 0

// Add toast
const addToast = (options) => {
  const id = ++toastIdCounter
  const toast = {
    id,
    type: options.type || 'info',
    title: options.title,
    message: options.message,
    duration: options.duration !== undefined ? options.duration : 5000,
    actions: options.actions,
    className: options.className || '',
    progress: 0
  }

  toasts.value.push(toast)

  // Auto remove after duration
  if (toast.duration > 0) {
    let startTime = Date.now()
    let progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / toast.duration) * 100, 100)

      const existingToast = toasts.value.find(t => t.id === id)
      if (existingToast) {
        existingToast.progress = progress
      }

      if (progress >= 100) {
        clearInterval(progressInterval)
        removeToast(id)
      }
    }, 50)
  }

  return id
}

// Remove toast
const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Handle action click
const handleAction = (toast, action) => {
  if (action.handler) {
    action.handler()
  }
  if (action.closeOnClick !== false) {
    removeToast(toast.id)
  }
}

// Clear all toasts
const clearAll = () => {
  toasts.value = []
}

// Provide methods to parent components
provide('toast', {
  add: addToast,
  remove: removeToast,
  clear: clearAll,

  // Convenience methods
  success: (message, options = {}) => addToast({ ...options, type: 'success', message }),
  error: (message, options = {}) => addToast({ ...options, type: 'error', message }),
  warning: (message, options = {}) => addToast({ ...options, type: 'warning', message }),
  info: (message, options = {}) => addToast({ ...options, type: 'info', message })
})

// Global toast composable
const useToast = () => {
  return inject('toast', {
    add: addToast,
    remove: removeToast,
    clear: clearAll,
    success: (message, options = {}) => addToast({ ...options, type: 'success', message }),
    error: (message, options = {}) => addToast({ ...options, type: 'error', message }),
    warning: (message, options = {}) => addToast({ ...options, type: 'warning', message }),
    info: (message, options = {}) => addToast({ ...options, type: 'info', message })
  })
}

// Export for global use
if (process.client) {
  window.$toast = {
    add: addToast,
    remove: removeToast,
    clear: clearAll,
    success: (message, options = {}) => addToast({ ...options, type: 'success', message }),
    error: (message, options = {}) => addToast({ ...options, type: 'error', message }),
    warning: (message, options = {}) => addToast({ ...options, type: 'warning', message }),
    info: (message, options = {}) => addToast({ ...options, type: 'info', message })
  }
}
</script>