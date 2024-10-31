// src/store/quizStore.ts
import { defineStore } from 'pinia';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [] as Array<{ text: string; options: string[]; answer: string }>,
    currentQuestionIndex: 0,
    score: 0,
    timer: 10,
    quizEnded: false,
    quizStarted: false, // Ajout de quizStarted ici
    selectedQuestions: [] as Array<{ text: string; options: string[]; answer: string }>
  }),
  actions: {
    async loadQuestions() {
      const response = await fetch('/questions.json');
      this.questions = await response.json();
    },
    startQuiz() {
      this.quizStarted = true; // Démarre le quiz
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.quizEnded = false;
      this.selectedQuestions = this.shuffleArray(this.questions).slice(0, 10);
    },
    shuffleArray(array: any[]) {
      return array.sort(() => Math.random() - 0.5);
    },
    incrementScore() {
      this.score++;
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.selectedQuestions.length - 1) {
        this.currentQuestionIndex++;
        this.timer = 10;
      } else {
        this.endQuiz();
      }
    },
    endQuiz() {
      this.quizEnded = true;
      this.quizStarted = false; // Termine le quiz
    }
  }
});
