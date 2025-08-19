<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-between">
    <!-- Mobile pagination -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        이전
      </button>
      <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        다음
      </button>
    </div>

    <!-- Desktop pagination -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <!-- Page info -->
      <div>
        <p class="text-sm text-gray-700">
          총 <span class="font-medium">{{ totalItems }}</span>개 중
          <span class="font-medium">{{ startItem }}</span>-<span class="font-medium">{{ endItem }}</span>개 표시
        </p>
      </div>

      <!-- Pagination controls -->
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Previous button -->
          <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">이전</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>

          <!-- First page -->
          <button
              v-if="showFirstPage"
              @click="goToPage(1)"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            1
          </button>

          <!-- First ellipsis -->
          <span
              v-if="showFirstEllipsis"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
          >
            ...
          </span>

          <!-- Page numbers -->
          <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0',
              page === currentPage
                ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                : 'text-gray-900 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>

          <!-- Last ellipsis -->
          <span
              v-if="showLastEllipsis"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
          >
            ...
          </span>

          <!-- Last page -->
          <button
              v-if="showLastPage"
              @click="goToPage(totalPages)"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            {{ totalPages }}
          </button>

          <!-- Next button -->
          <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">다음</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  // Current page number (1-based)
  currentPage: {
    type: Number,
    required: true,
    validator: (value) => value >= 1
  },

  // Total number of pages
  totalPages: {
    type: Number,
    required: true,
    validator: (value) => value >= 0
  },

  // Total number of items
  totalItems: {
    type: Number,
    default: 0
  },

  // Items per page
  itemsPerPage: {
    type: Number,
    default: 10
  },

  // Maximum number of visible page buttons
  maxVisiblePages: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:currentPage', 'pageChange'])

// Calculate visible page numbers
const visiblePages = computed(() => {
  const delta = Math.floor(props.maxVisiblePages / 2)
  let start = Math.max(1, props.currentPage - delta)
  let end = Math.min(props.totalPages, start + props.maxVisiblePages - 1)

  // Adjust start if we're near the end
  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(1, end - props.maxVisiblePages + 1)
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Show first page button
const showFirstPage = computed(() => {
  return visiblePages.value.length > 0 && visiblePages.value[0] > 1
})

// Show last page button
const showLastPage = computed(() => {
  return visiblePages.value.length > 0 && visiblePages.value[visiblePages.value.length - 1] < props.totalPages
})

// Show first ellipsis
const showFirstEllipsis = computed(() => {
  return visiblePages.value.length > 0 && visiblePages.value[0] > 2
})

// Show last ellipsis
const showLastEllipsis = computed(() => {
  return visiblePages.value.length > 0 && visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
})

// Calculate start item number
const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

// Calculate end item number
const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

// Go to specific page
const goToPage = (page) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) {
    return
  }

  emit('update:currentPage', page)
  emit('pageChange', page)
}
</script>