<template>
  <div class="app-container">
    <!-- Barre de navigation -->
    <nav class="bg-red-500 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Quiz de Culture Générale</h1>
      <div>
        <button @click="showStartScreen" class="mx-2 px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition">Accueil</button>
        <button @click="showLeaderboard" class="mx-2 px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition">Scores</button>
      </div>
    </nav>

    <!-- Contenu principal -->
    <div class="main-content p-6">
      <div v-if="currentView === 'start'">
        <QuizApp :view="currentView" @quiz-start="startQuiz" />
      </div>
      <div v-else-if="currentView === 'leaderboard'">
        <Leaderboard />
      </div>
      <div v-else>
        <QuizApp :view="currentView" @quiz-start="startQuiz" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import QuizApp from './components/QuizApp.vue';
import Leaderboard from './components/Leaderboard.vue';

export default defineComponent({
  components: { QuizApp, Leaderboard },
  setup() {
    const currentView = ref('start');

    const showStartScreen = () => {
      currentView.value = 'start';
    };

    const showLeaderboard = () => {
      currentView.value = 'leaderboard';
    };

    const startQuiz = () => {
      currentView.value = 'quiz';
    };

    return {
      currentView,
      showStartScreen,
      showLeaderboard,
      startQuiz
    };
  }
});
</script>

<style>
.app-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
