import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig> {
  // todo: create folded components with path change
  //    make universal subcomponents instead of chinese noodles
  routes: (_routes) => [
    {
      name: 'main',
      path: '/',
      component: () => import('~/pages/index.vue')
      // .then((r) => {
      //   console.info('R.')
      //   console.log(r)
      //   // return r => r.default || r
      // })
    },
    {
      name: 'w_main',
      path: '/w/:w',
      component: () => import('~/pages/w/_index.vue'),
    },
    {
      name: 'test',
      path: '/test',
      component: () => import('~/pages/test.vue')
      // .then((r) => {
      //   console.info('R.')
      //   console.log(r)
      //   return r => r.default || r
      // })
    },
    {
      name: 'admin',
      path: '/admin',
      component: () => import('~/pages/admin.vue')
      // .then((r) => {
      //   console.info('R.')
      //   console.log(r)
      //   return r => r.default || r
      // })
    },
  ],
}
