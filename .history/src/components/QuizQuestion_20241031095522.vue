<template>
    <div class="question-container text-center mb-4">
      <h2 class="text-xl font-semibold mb-4">{{ question.text }}</h2>
      
      <div class="options flex flex-col gap-2">
        <button
          v-for="option in question.options"
          :key="option"
          @click="selectAnswer(option)"
          class="option py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          {{ option }}
        </button>
      </div>
      
      <p class="mt-4 text-gray-700">Temps restant : <span class="font-semibold">{{ timer }}</span>s</p>
    </div>
  </template>
  
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    props: {
      question: Object as PropType<{ text: string; options: string[]; answer: string }>,
      timer: Number,
    },
    emits: ['answer'],
    setup(props, { emit }) {
      const selectAnswer = (option: string) => {
        emit('answer', option);
      };
      return { selectAnswer };
    },
  });
  </script>
  
  <style scoped>
  </style>