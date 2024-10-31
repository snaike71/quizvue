import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import QuizApp from '../src/components/QuizApp.vue';

describe('QuizApp.vue', () => {
  it('démarre avec un score de zéro', () => {
    const wrapper = mount(QuizApp);
    expect(wrapper.vm.score).toBe(0);
  });

  it('incrémente le score après une bonne réponse', async () => {
    const wrapper = mount(QuizApp);
    wrapper.vm.quizStarted = true; // Démarre le quiz
    await wrapper.vm.handleAnswer('Paris'); // Envoie une réponse correcte
    expect(wrapper.vm.score).toBe(1);
    expect(wrapper.vm.feedback).toBe('Bonne réponse !');
  });

  it('affiche le message de fin avec le score final', async () => {
    const wrapper = mount(QuizApp);
    wrapper.vm.quizStarted = true;
    wrapper.vm.currentQuestion = wrapper.vm.questions.length - 1; // Aller à la dernière question
    await wrapper.vm.handleAnswer('Paris'); // Envoie une réponse correcte pour la dernière question
    expect(wrapper.vm.quizEnded).toBe(true);
    expect(wrapper.find('.final-score').exists()).toBe(true);
  });
});
