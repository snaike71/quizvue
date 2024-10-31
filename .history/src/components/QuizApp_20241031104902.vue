<template>
  <div class="quiz-container max-w-xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md mt-10">
    <!-- Barre de progression -->
    <QuizProgress :currentIndex="quizStore.currentQuestionIndex" :totalQuestions="quizStore.selectedQuestions.length" />
    
    <!-- Feedback utilisateur -->
    <p v-if="feedbackMessage" 
       :class="{'text-green-500': isCorrect, 'text-red-500': !isCorrect}"
       class="text-center text-lg font-semibold mt-4 animate-fade">
      {{ feedbackMessage }}
    </p>
    
    <!-- Contenu du quiz ici... -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useQuizStore } from '@/store/quizStore';
import QuizProgress from './QuizProgress.vue';

export default defineComponent({
  components: { QuizProgress },
  setup() {
    const quizStore = useQuizStore();
    const feedbackMessage = ref('');
    const isCorrect = ref(false);

    const handleAnswer = (selectedAnswer: string | null) => {
      const isAnswerCorrect = selectedAnswer === quizStore.currentQuestion.answer;
      feedbackMessage.value = isAnswerCorrect ? "Bonne réponse !" : "Mauvaise réponse !";
      isCorrect.value = isAnswerCorrect;
      
      if (isAnswerCorrect) quizStore.incrementScore();
      quizStore.nextQuestion();
    };

    return { quizStore, feedbackMessage, isCorrect, handleAnswer };
  }
});
</script>

<style>
@keyframes fade {
  from { opacity: 1; }
  to { opacity: 0; }
}
.animate-fade {
  animation: fade 2s forwards;
}
</style>
