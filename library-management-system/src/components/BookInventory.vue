<template>
  <div class="inventory-container">
    <h1>Library Management System</h1>

    <BookForm
      :bookToEdit="bookToEdit"
      :isEditing="isEditing"
      @save-book="handleSaveBook"
      @update-book="handleUpdateBook"
      @cancel-edit="resetForm"
    />

    <BookTable :books="books" @edit-book="startEdit" @delete-book="confirmDelete" />

    <Modal :isOpen="showDeleteModal" @close="closeDeleteModal">
      <div class="modal-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svg-icon-modal">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
          />
        </svg>
      </div>
      <h3>Are you sure?</h3>
      <p>This action cannot be undone. The book will be permanently removed from the inventory.</p>

      <div class="modal-actions-container">
        <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Cancel</button>
        <button type="button" class="btn btn-danger" @click="executeDelete">Delete Book</button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Modal from './ui/Modal.vue'
import BookForm from './BookForm.vue'
import BookTable from './BookTable.vue'

interface Book {
  id: number
  title: string
  author: string
  year: number
  stock: number
}

const books = ref<Book[]>([])
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const bookToEdit = ref<Omit<Book, 'id'> | Book | null>(null)

const showDeleteModal = ref(false)
const bookIdToDelete = ref<number | null>(null)

onMounted(() => {
  const savedBooks = localStorage.getItem('library_inventory')
  if (savedBooks) {
    try {
      books.value = JSON.parse(savedBooks)
    } catch (e) {
      console.error('Error al cargar los libros desde localStorage', e)
      books.value = []
    }
  }
})

watch(
  books,
  (newBooks) => {
    localStorage.setItem('library_inventory', JSON.stringify(newBooks))
  },
  { deep: true },
)

const resetForm = () => {
  bookToEdit.value = null
  isEditing.value = false
  editingId.value = null
}

const handleSaveBook = (bookData: Omit<Book, 'id'>) => {
  const newId = books.value.length > 0 ? Math.max(...books.value.map((b) => b.id)) + 1 : 1
  books.value.push({
    id: newId,
    ...bookData,
  })
  resetForm()
}

const handleUpdateBook = (bookData: Omit<Book, 'id'>) => {
  if (editingId.value !== null) {
    const index = books.value.findIndex((b) => b.id === editingId.value)
    if (index !== -1) {
      books.value[index] = {
        id: editingId.value,
        ...bookData,
      }
    }
  }
  resetForm()
}

const startEdit = (book: Book) => {
  isEditing.value = true
  editingId.value = book.id
  bookToEdit.value = {
    title: book.title,
    author: book.author,
    year: book.year,
    stock: book.stock,
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const confirmDelete = (id: number) => {
  bookIdToDelete.value = id
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  bookIdToDelete.value = null
}

const executeDelete = () => {
  if (bookIdToDelete.value !== null) {
    const id = bookIdToDelete.value
    books.value = books.value.filter((book) => book.id !== id)
    if (editingId.value === id) resetForm()
  }
  closeDeleteModal()
}
</script>

<style scoped>
.inventory-container {
  max-width: 950px;
  margin: 1rem auto;
  padding: 0 1rem;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
  color: #334155;
}

h1 {
  text-align: center;
  color: #0f172a;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.025em;
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

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.modal-icon {
  width: 48px;
  height: 48px;
  background-color: #fef2f2;
  color: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
}

.svg-icon-modal {
  width: 28px;
  height: 28px;
  fill: currentColor;
}

h3 {
  margin: 0 0 0.5rem 0;
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
}

p {
  color: #64748b;
  font-size: 0.925rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
}

.modal-actions-container {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

@media (max-width: 767px) {
  .modal-actions-container {
    flex-direction: column-reverse;
  }
}

@media (min-width: 768px) {
  .inventory-container {
    margin: 2.5rem auto;
    padding: 0 1.25rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .btn {
    width: auto;
    font-size: 0.9rem;
    padding: 0.55rem 1.25rem;
  }
}
</style>
