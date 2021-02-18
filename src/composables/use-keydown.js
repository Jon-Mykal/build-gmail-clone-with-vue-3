import { onBeforeUnmount } from "vue";
let useKeydown = (keyCombos) => {
  // Function that will handle the keydown event
  let onKeydown = (event) => {
    // Captures event details.
    // Searches through the key combos to match the key pressed.
    let kc = keyCombos.find(kc => kc.key == event.key);

    // If key was pressed execute the function in the combo.
    if (kc) {
      // So far the executed functions mostly emit events.
      kc.fn();
    }
  };

  window.addEventListener("keydown", onKeydown);

  // Vue lifecycle hook.
  onBeforeUnmount(() => {
    // Remove the event listener before component is removed (Page refresh).
    window.removeEventListener("keydown", onKeydown);
  });
};

export default useKeydown;