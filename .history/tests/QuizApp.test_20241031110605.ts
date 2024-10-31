// tests/QuizApp.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useQuizStore } from '@/store/quizStore';
import QuizApp from '@/components/QuizApp.vue';

describe('QuizApp.vue', () => {
  // Configure Pinia avant chaque test
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('démarre avec un score de zéro', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });
    const quizStore = useQuizStore();

    // Vérifie que le score initial est de zéro
    expect(quizStore.score).toBe(0);
  });

  it('incrémente le score après une bonne réponse', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });
    const quizStore = useQuizStore();

    // Démarre le quiz et simule une réponse correcte
    await quizStore.startQuiz();
    await wrapper.vm.handleAnswer(quizStore.currentQuestion.answer);

    // Vérifie que le score a été incrémenté
    expect(quizStore.score).toBe(1);
    expect(wrapper.vm.feedbackMessage).toBe('Bonne réponse !');
  });

  it('affiche la question suivante après chaque réponse', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });
    const quizStore = useQuizStore();

    await quizStore.startQuiz();
    const initialQuestion = quizStore.currentQuestion;

    // Simule une réponse et vérifie que la question a changé
    await wrapper.vm.handleAnswer(initialQuestion.answer);
    expect(quizStore.currentQuestion).not.toBe(initialQuestion);
  });

  it('affiche le score final et termine le quiz', async () => {
    const wrapper = mount(QuizApp, {
      props: { view: 'quiz' }
    });
    const quizStore = useQuizStore();

    // Simule la fin du quiz en atteignant la dernière question
    await quizStore.startQuiz();
    quizStore.currentQuestionIndex = quizStore.selectedQuestions.length - 1;
    await wrapper.vm.handleAnswer(quizStore.currentQuestion.answer);

    // Vérifie que le quiz est terminé
    expect(quizStore.quizEnded).toBe(true);
    expect(wrapper.text()).toContain(`Votre score final : ${quizStore.score}`);
  });
});
