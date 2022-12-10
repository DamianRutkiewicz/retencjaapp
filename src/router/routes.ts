import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    redirect: { name: 'users' },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('pages/Users.vue'),
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('pages/User.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
