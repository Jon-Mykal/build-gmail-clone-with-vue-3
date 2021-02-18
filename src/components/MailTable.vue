<template>
<button @click="selectScreen('inbox')"
        :disabled="selectedScreen == 'inbox'">Inbox</button>
<button @click="selectScreen('archive')"
        :disabled="selectedScreen == 'archive'">Archive</button>
        <h3 v-if="selectedScreen == 'inbox'">Inbox</h3>
        <h3 v-else="selectedScreen == 'archive'">Archive</h3>
<BulkActionBar :emails="filteredEmails" />
    <table class="mail-table">
      <tbody>
        <tr v-for="email in filteredEmails" :key="email.id" :class="[email.read ? 'read': '', 'clickable']">
          <td>
            <input type="checkbox"
                    @click="emailSelection.toggle(email)"
                    :checked="emailSelection.emails.has(email)" />
          </td>
          <td @click="openEmail(email)">{{ email.from }}</td>
          <td @click="openEmail(email)"> 
            <p>
              <strong>{{ email.subject }}</strong> - {{ email.body }}
            </p>
          </td>
          <td class="date" @click="openEmail(email)">
            {{ format(new Date(email.sentAt), 'MMM do yyyy') }}
            </td>
          <td><button @click="archiveEmail(email)">Archive</button></td>
        </tr>
      </tbody>
    </table>
    <ModalView v-if="openedMail" @closeModal="openedMail = null">
      <MailView :email="openedMail" @changeEmail="changeEmail" />
    </ModalView>
</template>
  
<script>
import { format } from 'date-fns';
import axios from 'axios'
import { ref, reactive } from 'vue'
import MailView from '@/components/MailView.vue'
import ModalView from '@/components/ModalView.vue'
import useEmailSelection from '../composables/use-email-selection'
import BulkActionBar from '@/components/BulkActionBar.vue';


export default {
  name: "MailTable",
  components: {
    MailView,
    ModalView,
    BulkActionBar
  },
  async setup() {
    let response = await axios.get("http://localhost:3000/emails");
    let emails = response.data;


    return {
      emailSelection: useEmailSelection(),
      format,
      emails: ref(emails),
      openedMail: ref(null),
      selectedScreen: ref('inbox')
    };
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((e1, e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1;
      });
    },
    filteredEmails() {
      if (this.selectedScreen == 'inbox') {
        return this.sortedEmails.filter(e => !e.archived);
      }
      else {
        return this.sortedEmails.filter(e => e.archived);
      }
    }
  },
  methods: {
    selectScreen(newScreen) {
      this.selectedScreen = newScreen;
      this.emailSelection.clear();
    },
      openEmail(email) {
          this.openedMail = email;
          if (email) {
            email.read = true;
            this.updateEmail(email);
          }

      },
        archiveEmail(email) {
          email.archived = true;
          this.updateEmail(email);
      },
      changeEmail({toggleRead, toggleArchive, save, closeModal, changeIndex }) {
        let email = this.openedMail;
        if (toggleRead) { email.read = !email.read; }
        if (toggleArchive) { email.archived = !email.archived; }
        if (save) { this.updateEmail(email) }
        if (closeModal) { this.openedMail = null; }

        if (changeIndex) {
          let emails = this.filteredEmails;
          let currentIndex = emails.indexOf(this.openedMail);
          let newEmail = emails[currentIndex + changeIndex];
          this.openEmail(newEmail);
        }
      },
        updateEmail(email) {
          axios.put(`http://localhost:3000/emails/${email.id}`, email);
      }
  }
};
</script>

<style  scoped>

</style>
