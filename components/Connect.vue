<template lang="pug">
.row.frame.border-success
  .row.mb-3(v-if="disabled.status")
    strong Awaiting: {{ disabled.cause }}... &nbsp;
      span.spinner-border.ms-auto(role="status")

  .mb-3.row(v-if="connectedWallet")
    .debug-panel Connected wallet: <span class="debug-panel__wallet">{{ connectedWallet }}</span>

  .row
    .col
      button.mb-3.w-100(
        type="button"
        class="btn btn-outline-success"
        @click="connectWallet"
        :disabled="buttonDisabled"
      ) {{ buttonText }}
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import { useDisabled } from '~/composables/useDisabled'

const disabled = useDisabled()
const { $Blockchain } = useNuxtApp()

const connectedWallet = ref('')
const connectWallet = async () => {
  await $Blockchain.connect()
  await checkConnected([$Blockchain.Wallet])
}

const buttonText = ref('Connect Metamask')
const buttonDisabled = ref(false)
onMounted(async () => {
  $Blockchain.Ethereum.on("accountsChanged", async (accountsPassed) => {
    await checkConnected(accountsPassed)
  })
})

watch(connectedWallet, (value) => {
  const accounts = (value) ? [value] : []
  checkConnected(accounts)
})

const checkConnected = async (accounts) => {
  // if mm is not installed
  if (!$Blockchain.Ethereum) {
    $Blockchain.Nuxt.$emit('disabled', {
      cause: 'Please install Metamask and reload the page',
      status: true,
    })
    buttonText.value = 'Install Metamask'
    buttonDisabled.value = true
  }
  // if empty accounts
  else if (
    Array.isArray(accounts)
    && accounts.length <= 0
  ){
    buttonText.value = 'Connect Metamask'
    buttonDisabled.value = false
    $Blockchain.Nuxt.$emit('disabled', {
      cause: 'Please connect Metamask',
      status: true,
    })
    connectedWallet.value = ''
    buttonText.value = 'Connect Metamask'
    buttonDisabled.value = false
  }
  // is ok
  else {
    connectedWallet.value = accounts[0]
    buttonText.value = 'Metamask connected'
    buttonDisabled.value = true
  }
}
</script>

<style lang="sass">
.debug-panel
  &__wallet
    color: #6610f2
.spinner-border
  --bs-spinner-width: 1.5rem
  --bs-spinner-height: 1.5rem
</style>