import { reactive } from 'vue';

// Single instance
let emails = reactive(new Set());
export const useEmailSelection = () => {

    let toggle = (email) => {
        if (emails.has(email)) {
            emails.delete(email);
        }
        else {
            emails.add(email);
        }
    };

    let clear = () => {
        emails.clear();
    };

    let addMultiple = (newEmails) => {
        newEmails.forEach((email) => {
            emails.add(email);
        })
    }
    return {
        emails,
        toggle,
        clear,
        addMultiple
    }
};

export default useEmailSelection;