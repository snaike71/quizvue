import { defineStore } from 'pinia';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [] as Array<{ text: string; options: string[]; answer: string }>,
    currentQuestionIndex: 0,
    score: 0,
    timer: 10,
    quizEnded: false,
    selectedQuestions: [] as Array<{ text: string; options: string[]; answer: string }>,
  }),
  actions: {
    async loadQuestions() {
      const response = await fetch('/path/to/questions.json'); // Remplacez par le chemin réel
      const data = await response.json();
      this.questions = data;
    },
    startQuiz() {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.quizEnded = false;
      this.selectedQuestions = this.shuffleArray(this.questions).slice(0, 10); // 10 questions aléatoires
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
        this.timer = 10; // réinitialiser le minuteur pour chaque question
      } else {
        this.endQuiz();
      }
    },
    endQuiz() {
      this.quizEnded = true;
    },
  },
});
