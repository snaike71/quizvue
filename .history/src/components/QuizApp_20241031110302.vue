<template>
  <div class="quiz-container max-w-xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md mt-10">
    <div v-if="view === 'start' && !quizStore.quizStarted && !quizStore.quizEnded" class="text-center">
      <h1 class="text-2xl font-bold mb-6">Quiz de Culture Générale</h1>
      <button @click="startQuiz" class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
        Commencer le Quiz
      </button>
    </div>

    <div v-else-if="quizStore.quizStarted && !quizStore.quizEnded">
      <QuizProgress :currentIndex="quizStore.currentQuestionIndex" :totalQuestions="quizStore.selectedQuestions.length" />
      <QuizTimer :initialTime="quizStore.timer" @time-up="handleTimeUp" />
      <QuizQuestion :question="quizStore.currentQuestion" @answer="handleAnswer" />

      <p v-if="showFeedback" :class="{'text-green-500': isCorrect, 'text-red-500': !isCorrect}" class="text-center text-lg font-semibold mt-4">
        {{ feedbackMessage }}
      </p>
    </div>

    <div v-if="quizStore.quizEnded" class="text-center">
      <h2 class="text-xl font-bold">Votre score final : {{ quizStore.score }}/10</h2>
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

export default defineComponent({
  components: { QuizProgress, QuizQuestion, QuizTimer },
  props: {
    view: { type: String, default: 'start' }
  },
  setup(_, { emit }) {
    const quizStore = useQuizStore();
    const feedbackMessage = ref('');
    const isCorrect = ref(false);
    const showFeedback = ref(false);

    const startQuiz = async () => {
      await quizStore.loadQuestions();
      quizStore.startQuiz();
      emit('quiz-start');  // Émet un événement pour basculer sur l'affichage du quiz
    };

    const handleAnswer = (selectedAnswer: string | null) => {
      const correctAnswer = quizStore.currentQuestion.answer;
      isCorrect.value = selectedAnswer === correctAnswer;
      feedbackMessage.value = isCorrect.value ? "Bonne réponse !" : "Mauvaise réponse !";
      showFeedback.value = true;

      setTimeout(() => {
        showFeedback.value = false;
      }, 2000);

      if (isCorrect.value) quizStore.incrementScore();
      quizStore.nextQuestion();
    };

    const handleTimeUp = () => {
      handleAnswer(null);
    };

    return { quizStore, feedbackMessage, isCorrect, showFeedback, startQuiz, handleAnswer, handleTimeUp };
  }
});
</script>
