<template lang="pug">
.row.frame.border-success
  .row.mb-3(v-if="disabled.status")
    strong Awaiting: {{ disabled.cause }}... &nbsp;
      span.spinner-border.ms-auto.text-warning(role="status")

  .mb-3.row(v-if="connectedWallet")
    .debug-panel Connected wallet: {{ connectedWallet }}

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

// console.log(useDisabled)

const disabled = useDisabled()
// const disabled = reactive({cause: '', status: false})

const { $Blockchain } = useNuxtApp()

const connectedWallet = ref('')
const connectWallet = async () => {
  console.info('connectWallet()...')
  await $Blockchain.connect()
  connectedWallet.value = $Blockchain.Wallet
}

onMounted(async () => {
  if ($Blockchain.Accounts && $Blockchain.Accounts.length > 0) connectedWallet.value = $Blockchain.Accounts[0]

  if ($Blockchain.Ethereum) {
    const accounts = await $Blockchain.Web3.eth.getAccounts()
    if (accounts.length > 0) {
      connectedWallet.value = accounts[0]
    }
    $Blockchain.Ethereum.on("accountsChanged", async (accountsPassed) => {
      // Time to reload your interface with accounts[0]!
      const accounts = await $Blockchain.Web3.eth.getAccounts()
      connectedWallet.value = accounts[0]
    })
  } else {
    disabled.value = {
      cause: 'Please install Metamask and reload the page',
      status: true,
    }
  }
})
</script>
