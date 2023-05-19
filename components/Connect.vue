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
        :disabled="disabled.status"
      ) Connect Metamask
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useNuxtApp } from '#app'
import { useDisabled } from '~/composables/useDisabled'

const disabled = useDisabled()
const { $Blockchain } = useNuxtApp()

const connectedWallet = ref('')
const connectWallet = async () => {
  console.info('connectWallet()...')
  await $Blockchain.connect()
  connectedWallet.value = $Blockchain.Wallet
}

onMounted(async () => {
  if ($Blockchain.Ethereum) {
    const accounts = await $Blockchain.Web3.eth.getAccounts()
    if (accounts.length > 0) {
      connectedWallet.value = accounts[0]
    } else {
      $Blockchain.Nuxt.$emit('alert', {
        type: 'danger',
        message: 'Please connect Metamask',
      })
    }
    $Blockchain.Ethereum.on("accountsChanged", async (accountsPassed) => {
      connectedWallet.value = accountsPassed[0]
    })
  } else {
    $Blockchain.Nuxt.$emit('disabled', {
      cause: 'Please install Metamask and reload the page',
      status: true,
    })
  }
})
</script>

<style lang="sass">
.debug-panel
  &__wallet
    color: #6610f2
.spinner-border
  --bs-spinner-width: 1.5rem
  --bs-spinner-height: 1.5rem
</style>