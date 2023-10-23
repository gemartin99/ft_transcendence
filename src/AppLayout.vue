<template>
  <div class="app">
    <nav>
      <ul>
        <li><router-link to="/login">Iniciar Sesión</router-link></li>
        <li><router-link to="/chat">Chat</router-link></li>
        <li><router-link to="/game">Juegos</router-link></li>
        <li><router-link to="/stats">Estadísticas</router-link></li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class AppLayout extends Vue {}
</script>

<style scoped lang="scss">
nav {
  background-color: #333;
  padding: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: white;
  text-decoration: none;
}
</style>

