<template>
  <div class="mb-4">
    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" :style="{ width: progress + '%' }"></div>
    </div>
    <p class="text-center">Question {{ currentIndex + 1 }} sur {{ totalQuestions }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    currentIndex: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
  },
  computed: {
    progress() {
      return ((this.currentIndex + 1) / this.totalQuestions) * 100;
    }
  }
});
</script>
