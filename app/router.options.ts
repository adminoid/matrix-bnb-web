import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig> {
  // todo: create folded components with path change
  //    make universal subcomponents instead of chinese noodles
  routes: (_routes) => [
    {
      name: 'main',
      path: '/',
      component: () => import('~/pages/index.vue'),
      children: [
        {
          path: '',
          component: () => import('~/pages/read.vue'),
          name: 'read',
        },
        {
          path: 'write',
          component: () => import('~/pages/write.vue'),
          name: 'write',
        }
      ],
    },
    {
      name: 'w_main',
      path: '/w/:w',
      component: () => import('~/pages/w/_index.vue'),
      children: [
        {
          path: '',
          component: () => import('~/pages/read.vue'),
          name: 'w_read',
        },
        {
          path: 'write',
          component: () => import('~/pages/write.vue'),
          name: 'w_write',
        }
      ]
    },
    {
      name: 'admin',
      path: '/admin',
      component: () => import('~/pages/admin.vue')
    },
  ],
}
