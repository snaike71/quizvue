<template>
    <div class="quiz-container max-w-xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md mt-10">
      <div v-if="!quizStarted" class="welcome-container text-center">
        <h1 class="text-2xl font-bold mb-6">Quiz de Culture Générale</h1>
        <p class="text-lg mb-4">Testez vos connaissances</p>
        <button @click="startQuiz" class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
          Commencer le Quiz
        </button>
      </div>
  
      <div v-else>
        <h1 class="text-2xl font-bold text-center mb-6">Quiz de Culture Générale</h1>
        <QuizProgress :currentQuestion="currentQuestion" :totalQuestions="questions.length" :score="score" />
        <QuizQuestion v-if="currentQuestion < questions.length" :question="questions[currentQuestion]" @answer="handleAnswer" :timer="timer" />
        <p v-if="feedback && !quizEnded" class="feedback mt-4 text-lg font-semibold text-center" :class="{ 'text-green-500': isCorrect, 'text-red-500': !isCorrect }">
          {{ feedback }}
        </p>
  
        <div v-if="quizEnded" class="final-score mt-8 text-center">
          <h2 class="text-xl font-bold">Votre score final : {{ score }}/10</h2>
          <p class="text-lg mt-4">{{ feedbackMessage }}</p>
          <button @click="restartQuiz" class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Rejouer
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import QuizProgress from './QuizProgress.vue';
  import QuizQuestion from './QuizQuestion.vue';
  
  export default defineComponent({
    components: { QuizProgress, QuizQuestion },
    setup() {
      const quizStarted = ref(false);
      const questions = ref([
        { text: 'Quelle est la capitale de la France ?', options: ['Paris', 'Londres', 'Berlin', 'Madrid'], answer: 'Paris' },
        { text: 'Quel est le plus grand océan ?', options: ['Atlantique', 'Pacifique', 'Arctique', 'Indien'], answer: 'Pacifique' },
        // Ajoutez plus de questions ici
      ]);
      const currentQuestion = ref(0);
      const score = ref(0);
      const timer = ref(10);
      const feedback = ref('');
      const isCorrect = ref(false);
      const quizEnded = ref(false);
  
      const feedbackMessage = computed(() => {
        if (score.value === questions.value.length) return "Parfait !";
        if (score.value >= questions.value.length / 2) return "Pas mal !";
        return "Dommage";
      });
  
      const handleAnswer = (selectedAnswer: string) => {
        if (selectedAnswer === questions.value[currentQuestion.value].answer) {
          score.value += 1;
          feedback.value = "Bonne réponse !";
          isCorrect.value = true;
        } else {
          feedback.value = "Mauvaise réponse !";
          isCorrect.value = false;
        }
        nextQuestion();
      };
  
      const nextQuestion = () => {
        if (currentQuestion.value < questions.value.length - 1) {
          currentQuestion.value += 1;
        } else {
          quizEnded.value = true;
          feedback.value = '';
        }
      };
  
      const startQuiz = () => {
        quizStarted.value = true;
      };
  
      const restartQuiz = () => {
        quizStarted.value = false;
        currentQuestion.value = 0;
        score.value = 0;
        feedback.value = '';
        quizEnded.value = false;
      };
  
      return {
        quizStarted,
        questions,
        currentQuestion,
        score,
        feedbackMessage,
        feedback,
        isCorrect,
        quizEnded,
        handleAnswer,
        startQuiz,
        restartQuiz
      };
    },
  });
  </script>
  