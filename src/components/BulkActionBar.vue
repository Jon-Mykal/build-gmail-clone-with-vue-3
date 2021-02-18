<template>
    <div class="bulk-action-bar">
        <span class="checkbox">
        <input type="checkbox"
               :checked="allEmailsSelected"
               :class="[someEmailsSelected ? 'partial-check' : '']"
               @click="bulkSelect">
        </span>
        <span class="buttons">
            <button @click="emailSelection.markRead()"
                    :disabled="[...emailSelection.emails].every(e => e.read)">Mark Read</button>
            <button @click="emailSelection.markUnread()"
                    :disabled="[...emailSelection.emails].every(e => !e.read)">Mark Unread</button>
            <button @click="emailSelection.archive()"
                    :disabled="numberSelected === 0">Archive</button>
        </span>
    </div>
</template>

<script>
import { computed } from 'vue';
import useEmailSelection from '../composables/use-email-selection'

    export default {
       // name: "BulkActionBar",
       // Use props to access the props passed in.
       // This api doesn't have access to this.
        setup(props){
            let emailSelection =  useEmailSelection();
            // Becomes a reactive reference.
            let numberSelected = computed(() => emailSelection.emails.size);
            let numberEmails = computed(() => props.emails.length);
            let allEmailsSelected = computed(() => numberSelected.value === numberEmails.value);
            let someEmailsSelected = computed(() => {
                return numberSelected.value > 0 && numberSelected.value < numberEmails.value;
            });
            let bulkSelect = () => {
                if (allEmailsSelected.value) {
                    emailSelection.clear();
                }
                else {
                    emailSelection.addMultiple(props.emails);
                }
            };
            return {
                emailSelection,
                allEmailsSelected,
                someEmailsSelected,
                numberSelected,
                bulkSelect
            }
        },
        props: {
            emails: {
                type: Array,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>