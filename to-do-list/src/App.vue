<template>
  <div class="todo-container">
    <h1>My To-do List</h1>

    <form @submit.prevent="addTodo" class="todo-form">
      <input
        v-model.trim="newTodoText"
        type="text"
        placeholder="Add a new task..."
        maxlength="100"
      />
      <button type="submit" :disabled="!newTodoText">Add</button>
    </form>

    <p v-if="todos.length === 0" class="empty-state">No pending tasks!</p>

    <template v-else>
      <ul class="todo-list">
        <li v-for="todo in paginatedTodos" :key="todo.id" :class="{ completed: todo.completed }">
          <div class="todo-content">
            <template v-if="editingId === todo.id">
              <input
                v-model.trim="editText"
                type="text"
                class="edit-input"
                maxlength="100"
                @keyup.enter="saveEdit(todo.id)"
                @keyup.esc="cancelEdit"
              />
            </template>

            <template v-else>
              <input type="checkbox" v-model="todo.completed" :id="'todo-' + todo.id" />
              <label :for="'todo-' + todo.id">{{ todo.text }}</label>
            </template>
          </div>

          <div class="todo-actions">
            <template v-if="editingId === todo.id">
              <button
                @click="saveEdit(todo.id)"
                :disabled="!editText"
                class="action-btn save-btn"
                title="Save"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
              </button>

              <button @click="cancelEdit" class="action-btn cancel-btn" title="Cancel">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </template>

            <template v-else>
              <button
                @click="startEdit(todo)"
                class="action-btn edit-btn"
                title="Edit"
                :disabled="todo.completed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>

              <button @click="deleteTodo(todo.id)" class="action-btn delete-btn" title="Delete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  ></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </template>
          </div>
        </li>
      </ul>

      <div v-if="totalPages > 1" class="pagination-container">
        <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
          Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
          Next
        </button>
      </div>
    </template>

    <footer v-if="todos.length > 0" class="todo-footer">
      <span>Progress: {{ completedCount }} / {{ todos.length }} completed</span>
      <button @click="clearCompleted" v-if="completedCount > 0" class="clear-btn">
        Clear completed
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Todo {
  id: string
  text: string
  completed: boolean
}

const todos = ref<Todo[]>([])
const newTodoText = ref<string>('')
const editingId = ref<string | null>(null)
const editText = ref<string>('')

const currentPage = ref<number>(1)
const itemsPerPage = 4

onMounted(() => {
  const savedTodos = localStorage.getItem('vue-todo-tasks')
  if (savedTodos) {
    try {
      todos.value = JSON.parse(savedTodos) as Todo[]
    } catch (e) {
      console.error('Error parsing LocalStorage', e)
      todos.value = []
    }
  }
})

watch(
  todos,
  (newTodos) => {
    localStorage.setItem('vue-todo-tasks', JSON.stringify(newTodos))

    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
    }
  },
  { deep: true },
)

const totalPages = computed<number>(() => {
  return Math.ceil(todos.value.length / itemsPerPage)
})

const paginatedTodos = computed<Todo[]>(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return todos.value.slice(startIndex, endIndex)
})

const addTodo = (): void => {
  if (!newTodoText.value) return

  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text: newTodoText.value,
    completed: false,
  }

  todos.value.push(newTodo)
  newTodoText.value = ''
  currentPage.value = totalPages.value
}

const startEdit = (todo: Todo): void => {
  editingId.value = todo.id
  editText.value = todo.text
}

const saveEdit = (id: string): void => {
  if (!editText.value) return

  const todo = todos.value.find((t) => t.id === id)
  if (todo) {
    todo.text = editText.value
  }
  cancelEdit()
}

const cancelEdit = (): void => {
  editingId.value = null
  editText.value = ''
}

const deleteTodo = (id: string): void => {
  if (editingId.value === id) cancelEdit()
  todos.value = todos.value.filter((todo) => todo.id !== id)
}

const clearCompleted = (): void => {
  todos.value = todos.value.filter((todo) => !todo.completed)
}

const completedCount = computed<number>(() => {
  return todos.value.filter((todo) => todo.completed).length
})
</script>

<style scoped>
.todo-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  color: #2c3e50;
  border-radius: 16px;
  box-shadow: none;
  border: 1px solid #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  border: 1px solid #f0f0f0;
}

h1 {
  text-align: center;
  color: #35495e;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.todo-form input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
  color: #334155;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.todo-form input:focus {
  outline: none;
  border-color: #42b883;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.todo-form button {
  padding: 12px 20px;
  background-color: #42b883;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.todo-form button:hover:not(:disabled) {
  background-color: #33a06f;
}

.todo-form button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background-color: #f8fafc;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #edf2f7;
  transition: all 0.2s ease;
}

.todo-list li:hover {
  background-color: #f1f5f9;
  border-color: #e2e8f0;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  margin-right: 10px;
  min-width: 0;
}

.todo-content input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #42b883;
  flex-shrink: 0;
}

.todo-content label {
  cursor: pointer;
  font-size: 0.95rem;
  color: #334155;
  user-select: none;
  width: 100%;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-word;
}

.edit-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #42b883;
  border-radius: 6px;
  background-color: #ffffff;
  color: #334155;
  font-size: 0.95rem;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.edit-input:focus {
  outline: none;
}

::selection {
  background-color: rgba(66, 184, 131, 0.3);
}

.todo-list li.completed {
  background-color: #fafafa;
  border-color: #e2e8f0;
  opacity: 0.7;
}

.todo-list li.completed label {
  text-decoration: line-through;
  color: #94a3b8;
}

.todo-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 18px;
  height: 18px;
  transition: stroke 0.2s ease;
}

.edit-btn .icon {
  color: #64748b;
}
.delete-btn .icon {
  color: #64748b;
}
.save-btn .icon {
  color: #42b883;
}
.cancel-btn .icon {
  color: #64748b;
}

.edit-btn:hover:not(:disabled) {
  background-color: #e2e8f0;
}
.edit-btn:hover:not(:disabled) .icon {
  color: #3b82f6;
}

.delete-btn:hover {
  background-color: #fee2e2;
}
.delete-btn:hover .icon {
  color: #ef4444;
}

.save-btn:hover:not(:disabled) {
  background-color: #d1fae5;
}

.cancel-btn:hover {
  background-color: #f1f5f9;
  color: #000;
}

.action-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
  background: none;
}

.empty-state {
  text-align: center;
  color: #64748b;
  margin-top: 2rem;
}

.todo-footer {
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
}

.clear-btn {
  background-color: #fff;
  border: 1px solid #cbd5e1;
  color: #64748b;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 10px 0;
}

.page-btn {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.page-btn:hover:not(:disabled) {
  background-color: #42b883;
  color: white;
  border-color: #42b883;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}
</style>
