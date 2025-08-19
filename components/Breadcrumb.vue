<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol role="list" :class="['flex items-center space-x-2', className]">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <!-- Separator -->
        <ChevronRightIcon
            v-if="index > 0"
            class="h-4 w-4 text-gray-400 mr-2"
            aria-hidden="true"
        />

        <!-- Home icon for first item -->
        <HomeIcon
            v-if="index === 0 && showHomeIcon"
            class="h-4 w-4 text-gray-400 mr-1"
            aria-hidden="true"
        />

        <!-- Link or text -->
        <component
            :is="item.to && index !== items.length - 1 ? resolveComponent('NuxtLink') : 'span'"
            :to="item.to"
            :class="[
            'text-sm font-medium transition-colors',
            item.to && index !== items.length - 1
              ? 'text-gray-600 hover:text-blue-600'
              : 'text-gray-900'
          ]"
            :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </component>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  // Breadcrumb items array
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every(item =>
          item &&
          typeof item === 'object' &&
          typeof item.label === 'string'
      )
    }
  },

  // Show home icon for first item
  showHomeIcon: {
    type: Boolean,
    default: true
  },

  // Additional CSS classes
  className: {
    type: String,
    default: ''
  }
})

// Auto-generate breadcrumbs from route (if items not provided manually)
const route = useRoute()

// Helper function to generate breadcrumbs from route
const generateBreadcrumbs = () => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const breadcrumbs = [{ label: '홈', to: '/' }]

  let currentPath = ''

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Skip dynamic segments for now (could be enhanced later)
    if (segment.startsWith('[') && segment.endsWith(']')) {
      return
    }

    let label = segment

    // Customize labels based on path
    switch (segment) {
      case 'products':
        label = '상품'
        break
      case 'shops':
        label = '상점'
        break
      case 'cart':
        label = '장바구니'
        break
      case 'checkout':
        label = '주문/결제'
        break
      case 'orders':
        label = '주문 내역'
        break
      case 'search':
        label = '검색'
        break
      case 'login':
        label = '로그인'
        break
      case 'register':
        label = '회원가입'
        break
      default:
        // Capitalize first letter
        label = segment.charAt(0).toUpperCase() + segment.slice(1)
    }

    breadcrumbs.push({
      label,
      to: index === pathSegments.length - 1 ? undefined : currentPath
    })
  })

  return breadcrumbs
}

// Use provided items or generate from route
const finalItems = computed(() => {
  return props.items.length > 0 ? props.items : generateBreadcrumbs()
})

// Export items for external use
defineExpose({
  items: finalItems
})
</script>