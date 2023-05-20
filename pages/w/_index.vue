<template lang="pug">
.container
  .row
    .col-md-10.col-lg-8
      metamask
    .col-sm-2.col-lg-4
</template>

<script setup>
import Metamask from '~/components/Metamask'
import { onMounted } from 'vue'
import Web3 from 'web3'

const route = useRoute();

onMounted(async () => {
  // save to localStorage route.params.w
  const W = route.params.w
  if (Web3.utils.isAddress(W)) {
    localStorage.setItem('whose_param', W)
  } else {
    console.warn('incorrect whose wallet...')
    await navigateTo({ path: '/' })
  }
})
</script>

<style lang="sass">
.btn-group
  width: 600px
</style>
