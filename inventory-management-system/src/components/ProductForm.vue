<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Product } from '../types/product'

interface FormErrors {
  name?: string
  code?: string
  price?: string
  stock?: string
  category?: string
}

const props = defineProps<{
  productToEdit: Product | null
}>()

const emit = defineEmits<{
  (e: 'save', product: Product): void
  (e: 'cancel'): void
}>()

const errors = ref<FormErrors>({})
const maxPriceLimit = ref(999999.99)
const maxStockLimit = ref(9999)
const maxCodeLimit = ref(15)

const initialFormState = (): Product => ({
  name: '',
  code: '',
  price: 0,
  stock: 0,
  category: '',
})

const form = ref<Product>(initialFormState())

watch(
  () => props.productToEdit,
  (newProduct) => {
    errors.value = {}
    if (newProduct) {
      form.value = { ...newProduct }
    } else {
      form.value = initialFormState()
    }
  },
  { immediate: true },
)

const blockInvalidChars = (event: KeyboardEvent) => {
  if (['e', 'E', '+', '-'].includes(event.key)) {
    event.preventDefault()
  }
}

const handleStockInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value

  if (value.length > 4) {
    value = value.slice(0, 4)
    form.value.stock = Number(value)
    target.value = value
  }
}

const handlePriceInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value

  const parts = value.split('.')

  if (parts[0] && parts[0].length > 6) {
    parts[0] = parts[0].slice(0, 6)
  }

  if (parts[1] && parts[1].length > 2) {
    parts[1] = parts[1].slice(0, 2)
  }

  value = parts.join('.')
  form.value.price = value === '' ? 0 : Number(value)
  target.value = value
}

const validateForm = (): boolean => {
  const formErrors: FormErrors = {}

  if (!form.value.code.trim()) {
    formErrors.code = 'Code is required.'
  } else if (form.value.code.length > maxCodeLimit.value) {
    formErrors.code = `Code cannot exceed ${maxCodeLimit.value} characters.`
  }

  if (!form.value.name.trim()) {
    formErrors.name = 'Product name is required.'
  }

  if (form.value.price === undefined || form.value.price === null || isNaN(form.value.price)) {
    formErrors.price = 'Only numbers are allowed.'
  } else if (form.value.price <= 0) {
    formErrors.price = 'Price must be greater than $0.00 (Min: $0.01).'
  } else if (form.value.price > maxPriceLimit.value) {
    formErrors.price = `Price cannot exceed $${maxPriceLimit.value.toLocaleString()}.`
  }

  if (form.value.stock === undefined || form.value.stock === null || isNaN(form.value.stock)) {
    formErrors.stock = 'Only numbers are allowed.'
  } else if (form.value.stock < 0) {
    formErrors.stock = 'Stock cannot be negative.'
  } else if (form.value.stock > maxStockLimit.value) {
    formErrors.stock = `Stock cannot exceed ${maxStockLimit.value} units.`
  }

  if (!form.value.category.trim()) {
    formErrors.category = 'Category is required.'
  }

  errors.value = formErrors
  return Object.keys(formErrors).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return

  emit('save', { ...form.value })
  form.value = initialFormState()
  errors.value = {}
}

const handleCancel = () => {
  form.value = initialFormState()
  errors.value = {}
  emit('cancel')
}
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700"
  >
    <h3 class="text-lg font-bold mb-4 text-slate-800 dark:text-white">
      {{ productToEdit ? 'Edit Product' : 'Register New Product' }}
    </h3>

    <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Code</label>
        <input
          v-model="form.code"
          type="text"
          :maxlength="maxCodeLimit"
          class="mt-1 block w-full rounded-md p-2 text-slate-900 dark:text-white outline-none transition-all duration-200"
          :class="[
            errors.code
              ? 'border border-red-400 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border border-slate-200 bg-slate-50 dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400',
          ]"
        />
        <span v-if="errors.code" class="error-message">{{ errors.code }}</span>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >Product Name</label
        >
        <input
          v-model="form.name"
          type="text"
          class="mt-1 block w-full rounded-md p-2 text-slate-900 dark:text-white outline-none transition-all duration-200"
          :class="[
            errors.name
              ? 'border border-red-400 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border border-slate-200 bg-slate-50 dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400',
          ]"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Price ($)</label
          >
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            min="0"
            @keydown="blockInvalidChars"
            @input="handlePriceInput"
            class="mt-1 block w-full rounded-md p-2 text-slate-900 dark:text-white outline-none transition-all duration-200"
            :class="[
              errors.price
                ? 'border border-red-400 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border border-slate-200 bg-slate-50 dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400',
            ]"
          />
          <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Initial Stock</label
          >
          <input
            v-model.number="form.stock"
            type="number"
            min="0"
            @keydown="blockInvalidChars"
            @input="handleStockInput"
            class="mt-1 block w-full rounded-md p-2 text-slate-900 dark:text-white outline-none transition-all duration-200"
            :class="[
              errors.stock
                ? 'border border-red-400 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border border-slate-200 bg-slate-50 dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400',
            ]"
          />
          <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
        <input
          v-model="form.category"
          type="text"
          class="mt-1 block w-full rounded-md p-2 text-slate-900 dark:text-white outline-none transition-all duration-200"
          :class="[
            errors.category
              ? 'border border-red-400 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border border-slate-200 bg-slate-50 dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400',
          ]"
        />
        <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
      </div>

      <div class="flex justify-end space-x-2 pt-2">
        <button
          v-if="productToEdit"
          type="button"
          @click="handleCancel"
          class="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
        >
          {{ productToEdit ? 'Update' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.35rem;
  display: block;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
