<template>
  <div class="card list-card">
    <h2>Registered Books ({{ books.length }})</h2>

    <p v-if="books.length === 0" class="empty-message">
      No books in the inventory yet. Add the first one above!
    </p>

    <div v-else class="table-responsive">
      <table class="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>Stock</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td data-label="ID" class="col-id">{{ book.id }}</td>
            <td data-label="Title">
              <span class="book-title">{{ book.title }}</span>
            </td>
            <td data-label="Author">{{ book.author }}</td>
            <td data-label="Year">{{ book.year }}</td>
            <td data-label="Stock">
              <span :class="['badge', book.stock > 0 ? 'badge-success' : 'badge-danger']">
                {{ book.stock > 0 ? `${book.stock} units` : 'Out of stock' }}
              </span>
            </td>
            <td data-label="Actions" class="text-right-desktop">
              <div class="action-buttons">
                <button
                  type="button"
                  class="btn-icon btn-edit"
                  @click="emit('edit-book', book)"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svg-icon">
                    <path
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="btn-icon btn-delete"
                  @click="emit('delete-book', book.id)"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svg-icon">
                    <path
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Book {
  id: number
  title: string
  author: string
  year: number
  stock: number
}

defineProps<{
  books: Book[]
}>()

const emit = defineEmits<{
  (e: 'edit-book', book: Book): void
  (e: 'delete-book', id: number): void
}>()
</script>

<style scoped>
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

.action-buttons {
  display: flex;
  gap: 0.35rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  color: #64748b;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-edit:hover {
  background: #eef2ff;
  color: #4f46e5;
}

.btn-delete:hover {
  background: #fef2f2;
  color: #ef4444;
}

.btn-icon:active {
  transform: scale(0.92);
}

.svg-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.25rem;
}

.badge-success {
  background-color: #dcfce7;
  color: #15803d;
}

.badge-danger {
  background-color: #fee2e2;
  color: #b91c1c;
}

.book-title {
  font-weight: 600;
  color: #0f172a;
}

.empty-message {
  text-align: center;
  color: #64748b;
  margin-top: 2rem;
}

@media (max-width: 767px) {
  .card.list-card {
    padding: 1rem;
  }

  .table-responsive {
    overflow-x: visible;
  }

  .inventory-table {
    display: block;
    width: 100%;
  }

  .inventory-table thead {
    display: none;
  }

  .inventory-table tbody {
    display: block;
    width: 100%;
  }

  .inventory-table tr {
    display: block;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  }

  .inventory-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px dashed #f1f5f9;
    text-align: right;
    font-size: 0.95rem;
  }

  .inventory-table td:last-child {
    border-bottom: none;
  }

  .inventory-table td > span,
  .inventory-table td > div {
    text-align: right;
  }

  .inventory-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #64748b;
    text-align: left;
    padding-right: 1rem;
    font-size: 0.85rem;
  }

  .action-buttons {
    width: auto;
    justify-content: flex-end;
  }
}

@media (min-width: 768px) {
  .card {
    padding: 1.75rem;
    margin-bottom: 2rem;
  }

  .inventory-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;
  }

  .inventory-table th,
  .inventory-table td {
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
  }

  .inventory-table th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #475569;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .inventory-table tbody tr:nth-child(odd) {
    background-color: #ffffff;
  }

  .inventory-table tbody tr:nth-child(even) {
    background-color: #f8fafc;
  }

  .inventory-table tbody tr:hover {
    background-color: #f1f5f9;
  }

  .col-id {
    color: #64748b;
    font-size: 0.9rem;
  }

  .text-right {
    text-align: right;
  }

  .text-right-desktop {
    text-align: right;
  }

  .action-buttons {
    justify-content: flex-end;
  }
}
</style>
