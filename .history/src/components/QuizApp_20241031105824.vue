<template>
  <div class="quiz-container max-w-xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md mt-10">
    <!-- Écran d'accueil avec le bouton de démarrage -->
    <div v-if="!quizStore.quizStarted && !quizStore.quizEnded" class="text-center">
      <h1 class="text-2xl font-bold mb-6">Quiz de Culture Générale</h1>
      <button @click="startQuiz" class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
        Commencer le Quiz
      </button>
    </div>

    <!-- Section des questions et de la progression une fois le quiz démarré -->
    <div v-else-if="quizStore.quizStarted && !quizStore.quizEnded">
      <QuizProgress :currentIndex="quizStore.currentQuestionIndex" :totalQuestions="quizStore.selectedQuestions.length" />
      <QuizTimer :initialTime="quizStore.timer" @time-up="handleTimeUp" />
      <QuizQuestion :question="quizStore.currentQuestion" @answer="handleAnswer" />

      <!-- Affichage du feedback utilisateur -->
      <p v-if="showFeedback" 
         :class="{'text-green-500': isCorrect, 'text-red-500': !isCorrect}" 
         class="text-center text-lg font-semibold mt-4">
        {{ feedbackMessage }}
      </p>
    </div>

    <!-- Section des résultats à la fin du quiz -->
    <div v-if="quizStore.quizEnded" class="text-center">
      <h2 class="text-xl font-bold">Votre score final : {{ quizStore.score }}/10</h2>
      <Leaderboard />
      <button @click="startQuiz" class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Rejouer</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuizStore } from '@/store/quizStore';
import QuizProgress from './QuizProgress.vue';
import QuizQuestion from './QuizQuestion.vue';
import QuizTimer from './QuizTimer.vue';
import Leaderboard from './Leaderboard.vue';

export default defineComponent({
  components: { QuizProgress, QuizQuestion, QuizTimer, Leaderboard },
  setup() {
    const quizStore = useQuizStore();
    const feedbackMessage = ref('');
    const isCorrect = ref(false);
    const showFeedback = ref(false);

    // Démarre le quiz en chargeant les questions et en réinitialisant l'état
    const startQuiz = async () => {
      await quizStore.loadQuestions();
      quizStore.startQuiz();
      resetFeedback();
    };

    // Fonction pour gérer la réponse d'une question
    const handleAnswer = (selectedAnswer: string | null) => {
      const correctAnswer = quizStore.currentQuestion.answer;
      isCorrect.value = selectedAnswer === correctAnswer;
      feedbackMessage.value = isCorrect.value ? "Bonne réponse !" : "Mauvaise réponse !";
      showFeedback.value = true;

      // Masque le feedback après 2 secondes
      setTimeout(() => {
        showFeedback.value = false;
      }, 2000);

      if (isCorrect.value) quizStore.incrementScore();
      quizStore.nextQuestion();
    };

    // Passe à la question suivante si le temps est écoulé
    const handleTimeUp = () => {
      handleAnswer(null);
    };

    // Réinitialise le feedback
    const resetFeedback = () => {
      feedbackMessage.value = '';
      showFeedback.value = false;
    };

    return { quizStore, feedbackMessage, isCorrect, showFeedback, startQuiz, handleAnswer, handleTimeUp };
  }
});
</script>
