<template>
  <div class="quiz-container max-w-xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md mt-10">
    <div v-if="quizStore.quizStarted" class="text-center">
      <h1 class="text-2xl font-bold mb-6">Quiz de Culture Générale</h1>
      <button @click="startQuiz" class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
        Commencer le Quiz
      </button>
    </div>
    <div v-else>
      <QuizProgress />
      <QuizQuestion 
        v-if="!quizStore.quizEnded"
        :question="currentQuestion"
        @answer="handleAnswer" 
        :timer="quizStore.timer" 
      />
      <div v-if="quizStore.quizEnded" class="text-center">
        <h2 class="text-xl font-bold">Votre score final : {{ quizStore.score }}/10</h2>
        <button @click="startQuiz" class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Rejouer</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useQuizStore } from '@/store/quizStore';
import QuizProgress from './QuizProgress.vue';
import QuizQuestion from './QuizQuestion.vue';

export default defineComponent({
  components: { QuizProgress, QuizQuestion },
  setup() {
    const quizStore = useQuizStore();

    const startQuiz = async () => {
      await quizStore.loadQuestions();
      quizStore.startQuiz();
    };

    // Définition de handleAnswer pour gérer la réponse de l'utilisateur
    const handleAnswer = (selectedAnswer: string | null) => {
      const currentQuestion = quizStore.selectedQuestions[quizStore.currentQuestionIndex];
      if (selectedAnswer === currentQuestion.answer) {
        quizStore.incrementScore();
      }
      quizStore.nextQuestion();
    };

    onMounted(() => {
      startQuiz();
    });

    return {
      quizStore,
      startQuiz,
      handleAnswer, // Assurez-vous de retourner handleAnswer ici
      currentQuestion: quizStore.selectedQuestions[quizStore.currentQuestionIndex],
      timer: quizStore.timer
    };
  }
});
</script>
