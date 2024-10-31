// tests/QuizApp.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useQuizStore } from '@/store/quizStore';
import QuizApp from '@/components/QuizApp.vue';

// Mock des données de questions
const mockQuestions = [
  { text: "Quelle est la capitale de l'Allemagne ?", options: ["Berlin", "Paris", "Rome", "Madrid"], answer: "Berlin" },
  { text: "Quelle est la plus grande planète du système solaire ?", options: ["Terre", "Jupiter", "Mars", "Saturne"], answer: "Jupiter" },
  { text: "Quelle est la monnaie du Japon ?", options: ["Yen", "Euro", "Dollar", "Rouble"], answer: "Yen" },
];

describe('QuizApp.vue', () => {
  let quizStore: ReturnType<typeof useQuizStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    quizStore = useQuizStore();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockQuestions),
      })
    ) as jest.Mock;
  });

  it('démarre avec un score de zéro', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });

    await quizStore.loadQuestions();
    await quizStore.startQuiz();

    expect(quizStore.score).toBe(0);
  });

  it('incrémente le score après une bonne réponse', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });

    await quizStore.loadQuestions();
    await quizStore.startQuiz();

    const correctAnswer = quizStore.currentQuestion?.answer;
    if (!correctAnswer) throw new Error("Aucune question n'a été chargée.");

    await wrapper.vm.handleAnswer(correctAnswer);
    expect(quizStore.score).toBe(1);
  });

  it('affiche la question suivante après chaque réponse', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });

    await quizStore.loadQuestions();
    await quizStore.startQuiz();

    const initialQuestion = quizStore.currentQuestion;
    const correctAnswer = initialQuestion?.answer;
    if (!correctAnswer) throw new Error("Aucune question n'a été chargée.");

    await wrapper.vm.handleAnswer(correctAnswer);
    expect(quizStore.currentQuestion).not.toBe(initialQuestion);
  });

  it('affiche le score final et termine le quiz', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });

    await quizStore.loadQuestions();
    await quizStore.startQuiz();

    quizStore.currentQuestionIndex = quizStore.selectedQuestions.length - 1;
    const lastAnswer = quizStore.currentQuestion?.answer;
    if (!lastAnswer) throw new Error("Aucune question n'a été chargée.");

    await wrapper.vm.handleAnswer(lastAnswer);
    expect(quizStore.quizEnded).toBe(true);
    expect(wrapper.text()).toContain(`Votre score final : ${quizStore.score}`);
  });
});
