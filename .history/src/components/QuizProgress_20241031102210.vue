<template>
  <div class="mb-4">
    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div class="bg-blue-500 h-2 rounded-full" :style="{ width: progressPercentage + '%' }"></div>
    </div>
    <p>Question {{ quizStore.currentQuestionIndex + 1 }} sur {{ quizStore.selectedQuestions.length }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useQuizStore } from '@/store/quizStore';

export default defineComponent({
  setup() {
    const quizStore = useQuizStore();
    const progressPercentage = computed(() => (quizStore.currentQuestionIndex + 1) / quizStore.selectedQuestions.length * 100);

    return { quizStore, progressPercentage };
  }
});
</script>
