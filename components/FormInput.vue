<template>
  <div :class="['relative', wrapperClass]">
    <!-- Label -->
    <label
        v-if="label"
        :for="inputId"
        :class="[
        'block text-sm font-medium mb-1',
        error ? 'text-red-700' : 'text-gray-700',
        labelClass
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <!-- Prefix icon -->
      <div
          v-if="prefixIcon || $slots.prefix"
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <slot name="prefix">
          <component
              v-if="prefixIcon"
              :is="prefixIcon"
              :class="[
              'h-5 w-5',
              error ? 'text-red-400' : 'text-gray-400'
            ]"
          />
        </slot>
      </div>

      <!-- Input element -->
      <input
          :id="inputId"
          :type="computedType"
          :value="modelValue"
          @input="handleInput"
          @blur="handleBlur"
          @focus="handleFocus"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :min="min"
          :max="max"
          :step="step"
          :maxlength="maxlength"
          :pattern="pattern"
          :autocomplete="autocomplete"
          :class="[
          'block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
          // Padding adjustments for icons
          (prefixIcon || $slots.prefix) && 'pl-10',
          (suffixIcon || $slots.suffix || showPasswordToggle) && 'pr-10',
          // State-based styling
          error
            ? 'ring-red-300 focus:ring-red-500 text-red-900 placeholder:text-red-300'
            : 'ring-gray-300 focus:ring-blue-500',
          disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
          readonly && 'bg-gray-50',
          inputClass
        ]"
      />

      <!-- Suffix icon or password toggle -->
      <div
          v-if="suffixIcon || $slots.suffix || showPasswordToggle"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <slot name="suffix">
          <!-- Password toggle -->
          <button
              v-if="showPasswordToggle"
              @click="togglePasswordVisibility"
              type="button"
              class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <EyeIcon v-if="passwordVisible" class="h-5 w-5" />
            <EyeSlashIcon v-else class="h-5 w-5" />
          </button>

          <!-- Suffix icon -->
          <component
              v-else-if="suffixIcon"
              :is="suffixIcon"
              :class="[
              'h-5 w-5',
              error ? 'text-red-400' : 'text-gray-400'
            ]"
          />
        </slot>
      </div>
    </div>

    <!-- Helper text or error message -->
    <p
        v-if="error || helperText"
        :class="[
        'mt-1 text-sm',
        error ? 'text-red-600' : 'text-gray-600'
      ]"
    >
      {{ error || helperText }}
    </p>

    <!-- Character count -->
    <div
        v-if="showCharCount && maxlength"
        class="mt-1 text-right text-xs text-gray-500"
    >
      {{ characterCount }}/{{ maxlength }}
    </div>
  </div>
</template>

<script setup>
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  // v-model value
  modelValue: {
    type: [String, Number],
    default: ''
  },

  // Input type
  type: {
    type: String,
    default: 'text'
  },

  // Label
  label: {
    type: String,
    default: ''
  },

  // Placeholder
  placeholder: {
    type: String,
    default: ''
  },

  // Helper text
  helperText: {
    type: String,
    default: ''
  },

  // Error message
  error: {
    type: String,
    default: ''
  },

  // Icons
  prefixIcon: {
    type: [String, Object],
    default: null
  },

  suffixIcon: {
    type: [String, Object],
    default: null
  },

  // Input states
  disabled: {
    type: Boolean,
    default: false
  },

  readonly: {
    type: Boolean,
    default: false
  },

  required: {
    type: Boolean,
    default: false
  },

  // HTML attributes
  min: {
    type: [String, Number],
    default: undefined
  },

  max: {
    type: [String, Number],
    default: undefined
  },

  step: {
    type: [String, Number],
    default: undefined
  },

  maxlength: {
    type: [String, Number],
    default: undefined
  },

  pattern: {
    type: String,
    default: undefined
  },

  autocomplete: {
    type: String,
    default: undefined
  },

  // Show character count
  showCharCount: {
    type: Boolean,
    default: false
  },

  // Custom classes
  wrapperClass: {
    type: String,
    default: ''
  },

  labelClass: {
    type: String,
    default: ''
  },

  inputClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'input'
])

// Generate unique ID for input
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

// Password visibility state
const passwordVisible = ref(false)

// Show password toggle for password inputs
const showPasswordToggle = computed(() => props.type === 'password')

// Computed input type (for password toggle)
const computedType = computed(() => {
  if (props.type === 'password' && passwordVisible.value) {
    return 'text'
  }
  return props.type
})

// Character count
const characterCount = computed(() => {
  return String(props.modelValue || '').length
})

// Handle input
const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('input', event)
}

// Handle blur
const handleBlur = (event) => {
  emit('blur', event)
}

// Handle focus
const handleFocus = (event) => {
  emit('focus', event)
}

// Toggle password visibility
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}
</script>