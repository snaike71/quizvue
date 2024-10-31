<template>
    <div class="text-center text-lg font-semibold mb-2">Temps restant : {{ timeLeft }}s</div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, watch } from 'vue';
  
  export default defineComponent({
    props: {
      initialTime: { type: Number, default: 10 },
    },
    emits: ['time-up'],
    setup(props, { emit }) {
      const timeLeft = ref(props.initialTime);
      let timerInterval: ReturnType<typeof setInterval> | null = null;
  
      const startTimer = () => {
        clearInterval(timerInterval as ReturnType<typeof setInterval>);
        timerInterval = setInterval(() => {
          if (timeLeft.value > 0) {
            timeLeft.value--;
          } else {
            clearInterval(timerInterval as ReturnType<typeof setInterval>);
            emit('time-up');
          }
        }, 1000);
      };
  
      onMounted(startTimer);
      watch(() => props.initialTime, (newTime) => {
        timeLeft.value = newTime;
        startTimer();
      });
  
      return { timeLeft };
    }
  });
  </script>
  