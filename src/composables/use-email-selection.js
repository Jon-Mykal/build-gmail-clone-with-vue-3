import axios from 'axios';
import { reactive } from 'vue';

// Single instance
// A set is like an array with the exception of not being able
// to use duplicates. Unique entries.
// Reactive provides a way to make the data...reactive!
let emails = reactive(new Set());

// Export function to be used across the app
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
        });
    }

    let forSelected = (fn) => {
        emails.forEach((email) => {
            fn(email);
            axios.put(`http://localhost:3000/emails/${email.id}`, email);
        });
    };
    let markRead = () => {
        forSelected((e) => e.read = true);
    };    

    let markUnread = () => {
        forSelected((e) => e.read = false);
    };   

    let archive = () => {
        forSelected((e) => e.archived = true);
        // Clear the read emails.
        clear();
    }; 

    // Returns properties(reactive) and methods
    return {
        emails,
        toggle,
        clear,
        addMultiple,
        markRead,
        markUnread,
        archive
    }
};

export default useEmailSelection;