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
      name: 'test',
      path: '/test',
      component: () => import('~/pages/test.vue')
      // .then((r) => {
      //   console.info('R.')
      //   console.log(r)
      //   return r => r.default || r
      // })
    },
  ],
}
