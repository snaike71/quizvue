<template>
  <div class="question-container text-center mb-4">
    <h2 class="text-xl font-semibold mb-4">{{ question.text }}</h2>
    <div class="options flex flex-col gap-2">
      <button v-for="option in question.options" :key="option" @click="selectAnswer(option)" class="option py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
        {{ option }}
      </button>
    </div>
    <p class="mt-4 text-gray-700">Temps restant : <span class="font-semibold">{{ timer }}</span>s</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, onMounted, onUnmounted } from 'vue';
import { useQuizStore } from '@/store/quizStore';

export default defineComponent({
  props: {
    question: {
      type: Object as PropType<{ text: string; options: string[]; answer: string }>,
      required: true
    },
    timer: Number
  },
  emits: ['answer'],
  setup(props, { emit }) {
    const quizStore = useQuizStore();
    let timerInterval: ReturnType<typeof setInterval>;

    const startTimer = () => {
      timerInterval = setInterval(() => {
        quizStore.timer--;
        if (quizStore.timer === 0) {
          emit('answer', null);
          quizStore.nextQuestion();
        }
      }, 1000);
    };

    onMounted(() => startTimer());
    onUnmounted(() => clearInterval(timerInterval));

    const selectAnswer = (option: string) => {
      emit('answer', option);
      quizStore.nextQuestion();
    };

    return { selectAnswer };
  }
});
</script>
