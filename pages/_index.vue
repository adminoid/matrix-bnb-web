<template lang="pug">
.container
  .row
    .col
    .col-md-10.col-lg-10.col-xl-8
      .center-block(v-if="!eth && isMobile")
        .center-block__content
          h1 Click to qr code to open site in MetaMask
          a(:href="appLink")
            img(:src="'/' + $Blockchain.Config.QR_IMG")
      metamask(v-else)
    .col
</template>

<script setup>
// metamask link generates there https://metamask.github.io/metamask-deeplinks/
import { onMounted, computed } from 'vue'
import Web3 from 'web3'
import { useNuxtApp } from '#app'

const { $Blockchain } = useNuxtApp()
const { isMobile } = useDevice()
let isShowMobileStuff = ref(false)
let eth = ref(true)
nextTick(() => {
  eth.value = !!$Blockchain.Ethereum
  isShowMobileStuff = ref(!eth && isMobile)
})

const appLink = computed(() => {
  // get whose wallet
  const whoseWallet = localStorage.getItem('whose_param')
  return (whoseWallet)
    ? $Blockchain.Config.APP_LINK + whoseWallet
    : $Blockchain.Config.APP_LINK
})

const route = useRoute();
onMounted(async () => {
  // save to localStorage route.params.w
  const W = route.params.w
  if (Web3.utils.isAddress(W)) {
    localStorage.setItem('whose_param', W)
  }
  if (route.name !== 'read') {
    await navigateTo({ path: '/' })
  }
})
</script>

<style lang="sass">
.btn-group
  width: 600px
.center-block
  display: flex
  justify-content: center
  align-items: center
  &__content
    text-align: center
    h1
      max-width: 370px
</style>
