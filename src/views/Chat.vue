import AppLayout from '@/AppLayout.vue';

<template>
  <div class="chat">
    <div class="chat-history">
      <div v-for="message in chatHistory" :key="message.id" class="message">
        <div class="user">{{ message.user }}</div>
        <div class="text">{{ message.text }}</div>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Escribe un mensaje..." />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Chat extends Vue {
  chatHistory: Array<{ id: number; user: string; text: string }> = [
    { id: 1, user: 'Usuario 1', text: '¡Hola!' },
    { id: 2, user: 'Usuario 2', text: '¡Hola! ¿Cómo estás?' }
  ];
newMessage = '';

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.chatHistory.push({ id: Date.now(), user: 'Tú', text: this.newMessage });
      this.newMessage = '';
    }
  }
}
</script>

<style scoped lang="scss">
.chat {
  max-width: 600px;
  margin: auto;
}

.chat-history {
  border: 1px solid #ccc;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
}

.user {
  font-weight: bold;
}

.chat-input {
  margin-top: 10px;
}
</style>
