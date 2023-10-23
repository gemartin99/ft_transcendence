import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AppLayout from '@/AppLayout.vue';
import Login from '@/views/Login.vue';
import Chat from '@/views/Chat.vue';
//import GameView from '@/views/GameView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'AppLayout',
    component: AppLayout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: Login
      },
      {
        path: '/chat',
        name: 'Chat',
        component: Chat
      }/*,
      {
        path: '/game',
        name: 'Game',
        component: GameView
      }*/
      // Para agregar más rutas se agregan aquí según sea necesario
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
