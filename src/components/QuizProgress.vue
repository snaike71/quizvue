<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'QuizProgress',
  props: {
    currentQuestion: {
      type: Number,
      required: true,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 1,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  setup(props) {
    const progressPercentage = computed(() => {
      return (props.currentQuestion / props.totalQuestions) * 100;
    });
    return { progressPercentage };
  },
});
</script>