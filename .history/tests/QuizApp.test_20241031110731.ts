// tests/QuizApp.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useQuizStore } from '@/store/quizStore';
import QuizApp from '@/components/QuizApp.vue';

describe('QuizApp.vue', () => {
  let quizStore: ReturnType<typeof useQuizStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    quizStore = useQuizStore();
  });

  it('démarre avec un score de zéro', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });

    // S'assurer que le store a été chargé avant le test
    await quizStore.loadQuestions();
    await quizStore.startQuiz();

    // Vérifie que le score initial est de zéro
    expect(quizStore.score).toBe(0);
  });

  it('incrémente le score après une bonne réponse', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });

    await quizStore.loadQuestions();
    await quizStore.startQuiz();

    // S'assurer qu'il y a bien une question actuelle avec une réponse valide
    const correctAnswer = quizStore.currentQuestion?.answer;
    if (!correctAnswer) throw new Error("Aucune question n'a été chargée.");

    // Simule une réponse correcte
    await wrapper.vm.handleAnswer(correctAnswer);

    // Vérifie que le score a été incrémenté
    expect(quizStore.score).toBe(1);
  });

  it('affiche la question suivante après chaque réponse', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });

    await quizStore.loadQuestions();
    await quizStore.startQuiz();

    const initialQuestion = quizStore.currentQuestion;

    // Vérifie qu'il y a bien une question actuelle avec une réponse valide
    const correctAnswer = initialQuestion?.answer;
    if (!correctAnswer) throw new Error("Aucune question n'a été chargée.");

    // Simule une réponse et vérifie que la question a changé
    await wrapper.vm.handleAnswer(correctAnswer);
    expect(quizStore.currentQuestion).not.toBe(initialQuestion);
  });

  it('affiche le score final et termine le quiz', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });

    await quizStore.loadQuestions();
    await quizStore.startQuiz();

    // Simule la fin du quiz en atteignant la dernière question
    quizStore.currentQuestionIndex = quizStore.selectedQuestions.length - 1;
    const lastAnswer = quizStore.currentQuestion?.answer;
    if (!lastAnswer) throw new Error("Aucune question n'a été chargée.");

    await wrapper.vm.handleAnswer(lastAnswer);

    // Vérifie que le quiz est terminé
    expect(quizStore.quizEnded).toBe(true);
    expect(wrapper.text()).toContain(`Votre score final : ${quizStore.score}`);
  });
});
