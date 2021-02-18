<template>
    <div>
        <input type="checkbox"
               :checked="allEmailsSelected"
               :class="[someEmailsSelected ? 'partial-check' : '']"
               @click="bulkSelect">
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
            let numberEmails = props.emails.length;
            let allEmailsSelected = computed(() => numberSelected.value === numberEmails);
            let someEmailsSelected = computed(() => {
                return numberSelected.value > 0 && numberSelected.value < numberEmails;
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
                allEmailsSelected,
                someEmailsSelected,
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