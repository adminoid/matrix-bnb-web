<template lang="pug">
.row.frame.border-success
  .row.mb-3(v-if="disabled.status")
    strong Awaiting: {{ disabled.cause }}... &nbsp;
      span.spinner-border.ms-auto(
        v-if="!isAwaitConnect"
        role="status"
      )

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
import { onMounted, ref, watch, computed } from 'vue'
import { useNuxtApp } from '#app'
import { useDisabled } from '~/composables/useDisabled'

const { $Blockchain } = useNuxtApp()
const buttonText = ref('Connect Metamask')
const buttonDisabled = ref(false)
const disabled = useDisabled()
const connectedWallet = ref('')
const connectWallet = async () => {
  await $Blockchain.connect()
  await checkConnected([$Blockchain.Wallet])
}
const isAwaitConnect = computed(
  () => disabled.value.cause === 'Please connect Metamask'
)

const checkAccounts = async () => {
  const accounts = await $Blockchain.Web3.eth.getAccounts()
  await checkConnected(accounts)
  $Blockchain.Ethereum.on("accountsChanged", async (accountsPassed) => {
    await checkConnected(accountsPassed)
  })
}
onMounted(async () => {
  await checkAccounts()
})

$Blockchain.Nuxt.$on('connect-update', async () => {
  await checkAccounts()
})

watch(connectedWallet, (value) => {
  const accounts = (value) ? [value] : []
  checkConnected(accounts)
})

const checkConnected = async (accounts: any[]) => {
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
    $Blockchain.Wallet = ''
  }
  // is ok
  else {
    connectedWallet.value = accounts[0]
    buttonText.value = 'Metamask connected'
    buttonDisabled.value = true
  }
  $Blockchain.Nuxt.$emit('update-whose')
}
</script>

<style lang="sass">
.spinner-border
  --bs-spinner-width: 1.5rem
  --bs-spinner-height: 1.5rem
</style>