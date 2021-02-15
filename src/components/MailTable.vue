<template>
<h1>{{ emailSelection.emails.size}} emails selected</h1>
    <table class="mail-table">
      <tbody>
        <tr v-for="email in unarchivedEmails" :key="email.id" :class="[email.read ? 'read': '', 'clickable']">
          <td>
            <input type="checkbox"
                    @click="emailSelection.toggle(email)"
                    :selected="emailSelection.emails.has(email)" />
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

export default {
  name: "MailTable",
  components: {
    MailView,
    ModalView
  },
  async setup() {
    let response = await axios.get("http://localhost:3000/emails");
    let emails = response.data;

    let selectedEmails = reactive(new Set());
    let emailSelection = {
      emails: selectedEmails,
      toggle(email) {
        if (selectedEmails.has(email)) {
          selectedEmails.delete(email);
        }
        else {
          selectedEmails.add(email);
        }

        console.log(selectedEmails);
      }
    };
    return {
      emailSelection,
      format,
      emails: ref(emails),
      openedMail: ref(null)
    };
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((e1, e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1;
      });
    },
    unarchivedEmails() {
      return this.sortedEmails.filter(e => !e.archived);
    }
  },
  methods: {
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
          let emails = this.unarchivedEmails;
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
