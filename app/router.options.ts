import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig> {
  // todo: create folded components with path change
  //    make universal subcomponents instead of chinese noodles
  routes: (_routes) => [
    {
      name: 'main',
      path: '/',
      component: () => import('~/pages/_index.vue'),
      children: [
        {
          path: '',
          component: () => import('~/pages/write.vue'),
          name: 'write',
        },
        {
          path: 'read',
          component: () => import('~/pages/read.vue'),
          name: 'read',
        },
      ],
    },
    {
      name: 'main_w',
      path: '/:w',
      component: () => import('~/pages/_index.vue'),
    },
    {
      name: 'admin',
      path: '/admin',
      component: () => import('~/pages/admin.vue')
    },
  ],
}
