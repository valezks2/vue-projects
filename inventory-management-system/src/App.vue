<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Product } from './types/product'
import ProductForm from './components/ProductForm.vue'
import ProductTable from './components/ProductTable.vue'

const LOCAL_STORAGE_KEY = 'inventory_products'
const products = ref<Product[]>([])
const selectedProduct = ref<Product | null>(null)

onMounted(() => {
  const savedProducts = localStorage.getItem(LOCAL_STORAGE_KEY)

  if (savedProducts) {
    products.value = JSON.parse(savedProducts)
  } else {
    products.value = []
    saveToLocalStorage([])
  }
})

const saveToLocalStorage = (data: Product[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
}

const handleSaveProduct = (productData: Product) => {
  if (productData.id) {
    const index = products.value.findIndex((p) => p.id === productData.id)
    if (index !== -1) {
      products.value[index] = productData
    }
    selectedProduct.value = null
  } else {
    const newProduct = {
      ...productData,
      id: Date.now(),
    }
    products.value.push(newProduct)
  }

  saveToLocalStorage(products.value)
}

const handleEditRequest = (product: Product) => {
  selectedProduct.value = product

  const element = document.getElementById('form-container')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleDeleteRequest = (id: number) => {
  products.value = products.value.filter((p) => p.id !== id)
  saveToLocalStorage(products.value)

  if (selectedProduct.value?.id === id) {
    selectedProduct.value = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8 transition-colors">
    <div class="max-w-7xl mx-auto space-y-6">
      <header
        class="flex flex-col items-center text-center border-b border-slate-200 dark:border-slate-700 pb-5"
      >
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Inventory Management System
          </h1>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div id="form-container" class="lg:col-span-1 scroll-mt-6">
          <ProductForm
            :productToEdit="selectedProduct"
            @save="handleSaveProduct"
            @cancel="selectedProduct = null"
          />
        </div>

        <div class="lg:col-span-2">
          <ProductTable
            :products="products"
            @edit="handleEditRequest"
            @delete="handleDeleteRequest"
          />
        </div>
      </div>
    </div>
  </div>
</template>
