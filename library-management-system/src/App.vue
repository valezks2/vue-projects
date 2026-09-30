<script setup lang="ts">
import BookInventory from './components/BookInventory.vue'
</script>

<template>
  <main class="app-main">
    <BookInventory />
  </main>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    sans-serif;
}

.app-main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
