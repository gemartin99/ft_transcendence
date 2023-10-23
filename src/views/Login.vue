import AppLayout from '@/AppLayout.vue';

<template>
  <div class="login">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Usuario:</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Login extends Vue {
  username = '';
  password = '';

  login() {
    // Aquí puedes agregar la lógica para manejar el inicio de sesión
    console.log('Iniciando sesión con', this.username, this.password);
  }
}
</script>

<style scoped lang="scss">
.login {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}

form div {
  margin-bottom: 10px;
}

label {
  display: block;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 5px;
}

button {
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
}
</style>