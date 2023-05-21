<template lang="pug">
.row.frame.frame_no-top
  .mb-3.row(v-if="registerWhoseAddr")
    .debug-panel.text-success {{ registerWhoseAddr }}
  .mb-3.row
    .col.col-sm-3.mb-3
      label.col-form-label(for='register-whose') Register whose
      .input-group
        a.text-danger(href='#' @click="clearWhose") clear
    .col-sm-9.mb-3
      .input-group
        input#register-whose.form-control.col-4(
          :class="{'is-invalid': !!error}"
          type='text'
          v-model="registerWhoseAddr"
          :disabled="disabled.status || isDisabledWhoseInput"
          required
        )
        .invalid-feedback {{ error }}
  .row
    button(
      type="button"
      class="btn btn-outline-success"
      @click="registerWhose"
      :disabled="disabled.status"
    ) Register
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { useDisabled } from '~/composables/useDisabled'
import Web3 from 'web3'

const disabled = ref({cause: '', status: false})
disabled.value = useDisabled()
const { $Blockchain } = useNuxtApp()

const registerWhoseAddr = ref('')
const error = ref('')
watch(registerWhoseAddr, async (newValue) => {
  await validateValue(newValue)
})

const clearWhose = () => {
  localStorage.removeItem('whose_param')
  registerWhoseAddr.value = ''
}

const validateValue = async (value) => {
  const accounts = await $Blockchain.Web3.eth.getAccounts();
  if (!accounts || !$Blockchain.Wallet) {
    error.value = 'Please connect your wallet first'
  } else {
    if (!Web3.utils.isAddress(value)) {
      error.value = 'please enter valid ethereum address'
    } else if (value.toLowerCase() === $Blockchain.Wallet.toLowerCase()) {
      error.value = 'Is not possible to be whose to yourself'
    } else {
      error.value = ''
    }
  }
}

const registerWhose = async () => {
  await validateValue(registerWhoseAddr.value)
  if (!error.value) {
    await $Blockchain.registerWhose(registerWhoseAddr.value)
  }
}

$Blockchain.Nuxt.$on('update-whose', () => {
  const whoseWallet = localStorage.getItem('whose_param')
  if (whoseWallet) {
    validateValue(whoseWallet)
  }
})

const isDisabledWhoseInput = ref(false)
onMounted(async () => {
  let whose = localStorage.getItem('whose_param')
  if (whose) {
    registerWhoseAddr.value = whose
    isDisabledWhoseInput.value = true
  }
})
</script>

<style lang="sass">
.invalid-feedback
  width: 100%
  margin-top: .25rem
  font-size: .875em
  color: #dc3545
</style>