<template lang="pug">
.container
  .row
    .col
    .col-md-10.col-lg-10.col-xl-8
      metamask
    .col
</template>

<script setup>

// TODO: after setup whose always redirect to /

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
    await navigateTo({ path: '/' })
  }
})
</script>

<style lang="sass">
.btn-group
  width: 600px
</style>
