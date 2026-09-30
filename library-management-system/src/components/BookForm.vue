<template>
  <div class="card form-card">
    <h2>{{ isEditing ? 'Edit Book' : 'Add New Book' }}</h2>
    <form @submit.prevent="handleSubmit" novalidate>
      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="currentBook.title"
          type="text"
          placeholder="E.g., One Hundred Years of Solitude"
          :class="{ 'input-error': errors.title }"
        />
        <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
      </div>

      <div class="form-group">
        <label for="author">Author</label>
        <input
          id="author"
          v-model="currentBook.author"
          type="text"
          placeholder="E.g., Gabriel García Márquez"
          :class="{ 'input-error': errors.author }"
        />
        <span v-if="errors.author" class="error-message">{{ errors.author }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="year">Publication Year</label>
          <input
            id="year"
            v-model.number="currentBook.year"
            type="number"
            :max="currentYear"
            :class="{ 'input-error': errors.year }"
            @keydown="blockInvalidChars"
          />
          <span v-if="errors.year" class="error-message">{{ errors.year }}</span>
        </div>

        <div class="form-group">
          <label for="stock">Inventory Stock</label>
          <input
            id="stock"
            v-model.number="currentBook.stock"
            type="number"
            min="0"
            :max="maxStockLimit"
            :class="{ 'input-error': errors.stock }"
            @keydown="blockInvalidChars"
          />
          <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Save Changes' : 'Add Book' }}
        </button>
        <button v-if="isEditing" type="button" class="btn btn-secondary" @click="cancelForm">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Book {
  id: number
  title: string
  author: string
  year: number
  stock: number
}

interface FormErrors {
  title?: string
  author?: string
  year?: string
  stock?: string
}

const props = defineProps<{
  bookToEdit: Omit<Book, 'id'> | Book | null
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'save-book', bookData: Omit<Book, 'id'>): void
  (e: 'update-book', bookData: any): void
  (e: 'cancel-edit'): void
}>()

const currentYear = computed(() => new Date().getFullYear())
const maxStockLimit = ref(9999)
const errors = ref<FormErrors>({})

const initialFormState = (): Omit<Book, 'id'> => ({
  title: '',
  author: '',
  year: new Date().getFullYear(),
  stock: 1,
})

const currentBook = ref(initialFormState())

watch(
  () => props.bookToEdit,
  (newBook) => {
    if (newBook) {
      currentBook.value = { ...newBook }
    } else {
      currentBook.value = initialFormState()
    }
  },
  { deep: true },
)

const blockInvalidChars = (event: KeyboardEvent) => {
  if (['e', 'E', '+', '-', '.'].includes(event.key)) {
    event.preventDefault()
  }
}

const validateForm = (): boolean => {
  const formErrors: FormErrors = {}

  if (!currentBook.value.title.trim()) {
    formErrors.title = 'Title is required.'
  }

  if (!currentBook.value.author.trim()) {
    formErrors.author = 'Author is required.'
  }

  if (
    currentBook.value.year === undefined ||
    currentBook.value.year === null ||
    isNaN(currentBook.value.year)
  ) {
    formErrors.year = 'Only numbers are allowed.'
  } else if (currentBook.value.year > currentYear.value) {
    formErrors.year = `Year cannot be in the future (Max: ${currentYear.value}).`
  }

  if (
    currentBook.value.stock === undefined ||
    currentBook.value.stock === null ||
    isNaN(currentBook.value.stock)
  ) {
    formErrors.stock = 'Only numbers are allowed.'
  } else if (currentBook.value.stock < 0) {
    formErrors.stock = 'Stock cannot be negative.'
  } else if (currentBook.value.stock > maxStockLimit.value) {
    formErrors.stock = `Stock cannot exceed the maximum limit of ${maxStockLimit.value} units.`
  }

  errors.value = formErrors
  return Object.keys(formErrors).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return

  if (props.isEditing) {
    emit('update-book', currentBook.value)
  } else {
    emit('save-book', currentBook.value)
    currentBook.value = initialFormState()
  }
}

const cancelForm = () => {
  currentBook.value = initialFormState()
  errors.value = {}
  emit('cancel-edit')
}
</script>

<style scoped>
.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.35rem;
  display: block;
  animation: fadeIn 0.2s ease-in-out;
}

input.input-error {
  border-color: #f87171;
  background-color: #fef2f2;
}

input.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
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

h2 {
  margin-top: 0;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.05),
    0 1px 2px -1px rgba(0, 0, 0, 0.05),
    0 4px 6px -1px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
}

input {
  padding: 0.625rem 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
  color: #1e293b;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

input::placeholder {
  color: #94a3b8;
}

input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  width: 100%;
  text-align: center;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

@media (min-width: 768px) {
  .card {
    padding: 1.75rem;
    margin-bottom: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr 1fr;
  }

  .form-actions {
    flex-direction: row;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .btn {
    width: auto;
    font-size: 0.9rem;
    padding: 0.55rem 1.25rem;
  }
}
</style>
