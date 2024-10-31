// src/store/quizStore.ts
import { defineStore } from 'pinia';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [] as Array<{ text: string; options: string[]; answer: string }>,
    selectedQuestions: [] as Array<{ text: string; options: string[]; answer: string }>,
    currentQuestionIndex: 0,
    score: 0,
    timer: 10,
    quizStarted: false,
    quizEnded: false,
    leaderboard: JSON.parse(localStorage.getItem('quizScores') || '[]') as Array<{ score: number; date: string }>
  }),
  actions: {
    async loadQuestions() {
      const response = await fetch('/questions.json');
      this.questions = await response.json();
      this.selectedQuestions = this.shuffleArray(this.questions).slice(0, 10);
    },
    startQuiz() {
      this.quizStarted = true;
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.quizEnded = false;
      this.timer = 10;
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.selectedQuestions.length - 1) {
        this.currentQuestionIndex++;
        this.timer = 10;
      } else {
        this.endQuiz();
      }
    },
    incrementScore() {
      this.score++;
    },
    endQuiz() {
      this.quizEnded = true;
      this.quizStarted = false;
      this.saveScore();
    },
    saveScore() {
      const newScore = { score: this.score, date: new Date().toISOString() };
      this.leaderboard.push(newScore);
      localStorage.setItem('quizScores', JSON.stringify(this.leaderboard));
    },
    shuffleArray(array: any[]) {
      return array.sort(() => Math.random() - 0.5);
    }
  },
  getters: {
    progressPercentage(state) {
      return ((state.currentQuestionIndex + 1) / state.selectedQuestions.length) * 100;
    },
    currentQuestion(state) {
      return state.selectedQuestions[state.currentQuestionIndex];
    }
  }
});
