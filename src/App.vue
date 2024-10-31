<template>
  <div class="app">
    <QuizApp />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import QuizApp from './components/QuizApp.vue';

export default defineComponent({
  name: 'App',
  components: {
    QuizApp
  }
});
</script>
