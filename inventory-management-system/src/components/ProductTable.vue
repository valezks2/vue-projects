<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '../types/product'
import BaseModal from './ui/Modal.vue'

const props = defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  (e: 'edit', product: Product): void
  (e: 'delete', id: number): void
}>()

const search = ref('')

const isDeleteModalOpen = ref(false)
const productToDelete = ref<Product | null>(null)

const filteredProducts = computed(() => {
  return props.products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      p.code.toLowerCase().includes(search.value.toLowerCase()) ||
      p.category.toLowerCase().includes(search.value.toLowerCase()),
  )
})

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  productToDelete.value = null
}

const handleConfirmDelete = () => {
  if (productToDelete.value?.id) {
    emit('delete', productToDelete.value.id)
  }
  closeDeleteModal()
}
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700"
  >
    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search by name, code or category..."
        class="mt-1 block w-full rounded-md p-2 text-slate-900 dark:text-white outline-none border border-slate-200 bg-slate-50 dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400 transition-all duration-200"
      />
    </div>

    <div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-left text-sm">
        <thead
          class="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 uppercase text-xs font-semibold"
        >
          <tr>
            <th class="px-4 py-3">Code</th>
            <th class="px-4 py-3">Product</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3 text-right">Price</th>
            <th class="px-4 py-3 text-center">Stock</th>
            <th class="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody
          class="divide-y divide-slate-200 dark:divide-slate-700 text-slate-900 dark:text-slate-100"
        >
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            class="hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <td class="px-4 py-3 font-mono text-xs">{{ product.code }}</td>
            <td class="px-4 py-3 font-medium">{{ product.name }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded-full">{{
                product.category || 'N/A'
              }}</span>
            </td>
            <td class="px-4 py-3 text-right font-semibold">${{ product.price.toFixed(2) }}</td>
            <td class="px-4 py-3 text-center">
              <span
                :class="[
                  'px-2.5 py-1 text-xs font-bold rounded-full',
                  product.stock === 0
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                ]"
              >
                {{ product.stock }} units
              </span>
            </td>
            <td class="px-4 py-3 text-center space-x-2">
              <button
                @click="emit('edit', product)"
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium cursor-pointer"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(product)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium cursor-pointer"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="6" class="text-center py-8 text-slate-500 dark:text-slate-400">
              No products found in the inventory.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :isOpen="isDeleteModalOpen" @close="closeDeleteModal">
      <div class="text-slate-800 dark:text-white">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4"
        >
          <svg
            class="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h3 class="text-lg font-bold mb-2">Delete Product</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Are you sure you want to delete
          <span class="font-semibold text-slate-700 dark:text-slate-200"
            >"{{ productToDelete?.name }}"</span
          >? This action cannot be undone.
        </p>

        <div class="flex justify-center space-x-3">
          <button
            type="button"
            @click="closeDeleteModal"
            class="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleConfirmDelete"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium cursor-pointer transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
