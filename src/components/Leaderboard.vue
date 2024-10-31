<template>
    <div>
      <h2 class="text-center text-xl font-bold mt-6">Classement</h2>
      <ul>
        <li v-for="score in sortedScores" :key="score.date" class="text-center">
          {{ new Date(score.date).toLocaleDateString() }} - {{ score.score }} points
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useQuizStore } from '@/store/quizStore';
  
  export default defineComponent({
    setup() {
      const quizStore = useQuizStore();
      const sortedScores = computed(() =>
        quizStore.leaderboard.slice().sort((a, b) => b.score - a.score)
      );
  
      return { sortedScores };
    }
  });
  </script>
  