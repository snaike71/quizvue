<template>
  <div class="quiz-container max-w-xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md mt-10">
    <!-- Écran d'accueil avec le bouton de démarrage -->
    <div v-if="!quizStore.quizStarted" class="text-center">
      <h1 class="text-2xl font-bold mb-6">Quiz de Culture Générale</h1>
      <button @click="startQuiz" class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
        Commencer le Quiz
      </button>
    </div>

    <!-- Écran du quiz une fois démarré -->
    <div v-else>
      <QuizProgress :progress="quizStore.progressPercentage" />
      <QuizQuestion 
        v-if="!quizStore.quizEnded"
        :question="currentQuestion"
        @answer="handleAnswer" 
        :timer="timer" 
      />
      <!-- Affichage du score final une fois le quiz terminé -->
      <div v-if="quizStore.quizEnded" class="text-center">
        <h2 class="text-xl font-bold">Votre score final : {{ quizStore.score }}/10</h2>
        <button @click="startQuiz" class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Rejouer</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onUnmounted } from 'vue';
import { useQuizStore } from '@/store/quizStore';
import QuizProgress from './QuizProgress.vue';
import QuizQuestion from './QuizQuestion.vue';

export default defineComponent({
  components: { QuizProgress, QuizQuestion },
  setup() {
    const quizStore = useQuizStore();
    const timer = ref(10);
    let timerInterval: ReturnType<typeof setInterval> | null = null;

    // Fonction pour démarrer le quiz
    const startQuiz = async () => {
      await quizStore.loadQuestions();
      quizStore.startQuiz();
      startTimer();
    };

    // Fonction pour démarrer et réinitialiser le minuteur
    const startTimer = () => {
      clearInterval(timerInterval as ReturnType<typeof setInterval>);
      timer.value = 10;
      timerInterval = setInterval(() => {
        if (timer.value > 0) {
          timer.value -= 1;
        } else {
          //handleAnswer(null); // Si le temps est écoulé, passe à la question suivante
        }
      }, 1000);
    };

    // Fonction pour gérer la réponse d'une question
    const handleAnswer = (selectedAnswer: string | null) => {
      const currentQuestion = quizStore.selectedQuestions[quizStore.currentQuestionIndex];
      if (selectedAnswer === currentQuestion.answer) {
        quizStore.incrementScore();
      }
      quizStore.nextQuestion();
      if (!quizStore.quizEnded) {
        startTimer(); // Redémarre le minuteur pour la prochaine question
      } else {
        clearInterval(timerInterval as ReturnType<typeof setInterval>);
      }
    };

    // Arrêter le minuteur lorsqu'on quitte le composant
    onUnmounted(() => {
      clearInterval(timerInterval as ReturnType<typeof setInterval>);
    });

    return {
      quizStore,
      startQuiz,
      handleAnswer,
      currentQuestion: computed(() => quizStore.selectedQuestions[quizStore.currentQuestionIndex]),
      timer
    };
  }
});
</script>
