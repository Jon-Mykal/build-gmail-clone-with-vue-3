<template>
  <!-- ModalView.vue template -->
  <div class="modal">
    <div class="overlay" @click="emit('closeModal')"></div>
    <div class="modal-card">
      <slot />
    </div>
  </div>
</template>

<script>
import useKeydown from "../composables/use-keydown"
export default {
  name: "ModalView",
  setup(props, { emit }) {
    // Emit providing a way to pass data to a parent component.
    // This one has no payload.

    // The following is a composable.
    // Provides a way to share code/functionality across components.
    // This one hooks up a keydown event and 
      useKeydown([
          { key: 'Escape', fn: () => { emit('closeModal')} }
      ]);
      // Emit is returned to make it accessible in the template.
    return {
      emit
    };
  }
};
</script>

<style scoped>
</style>