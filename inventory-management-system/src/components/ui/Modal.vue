<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 w-screen h-screen bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 box-border animate-fade-in"
    @click.self="closeModal"
  >
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl box-border text-center border border-slate-200 dark:border-slate-700 animate-scale-up"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const closeModal = () => {
  emit('close')
}

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeInOverlay 0.2s ease-out forwards;
}

.animate-scale-up {
  animation: scaleUpModal 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes fadeInOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleUpModal {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
