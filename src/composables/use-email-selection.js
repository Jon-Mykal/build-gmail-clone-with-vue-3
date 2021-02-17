import { reactive } from 'vue';

// Single instance
let emails = reactive(new Set());
export const useEmailSelection = () => {

    return {
        emails,
        toggle(email) {
            if (emails.has(email)) {
                emails.delete(email);
            }
            else {
                emails.add(email);
            }
        }
    }
};

export default useEmailSelection;