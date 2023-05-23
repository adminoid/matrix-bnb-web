<template lang="pug">
.row.frame
  .mb-3.row
    .fst-italic Same as just send bnb from wallet to contract address
  .mb-3.row
    .col.col-sm-3.mb-3
      label.col-form-label(for='send-amount') Send amount
    .col-sm-9.mb-3
      .input-group
        input#send-amount.form-control.col-4(
          :class="{'is-invalid': !!error}"
          type='text'
          v-model="amountValue"
          :disabled="disabled.status"
          required
        )
        .invalid-feedback {{ error }}
  .row
    button(
      type="button"
      class="btn btn-outline-primary"
      @click="sendAmount"
      :disabled="disabled.status"
    ) Send
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import { useDisabled } from '~/composables/useDisabled'

const disabled = useDisabled()
const { $Blockchain } = useNuxtApp()

const amountValue = ref('')
const error = ref('')
watch(amountValue, async (newValue) => {
  await validateValue(newValue)
})

const validateValue = async (value) => {
  const accounts = await $Blockchain.Web3.eth.getAccounts();
  if (!accounts || !$Blockchain.Wallet) {
    error.value = 'Please connect your wallet first'
  } else {
    if (String(value).includes(',')) {
      value = String(value).replace(/,/g, '.')
      amountValue.value = value
    }
    if (isNaN(Number(value))) {
      error.value = 'please enter a valid number'
    } else if (Number(value) <= 0) {
      error.value = 'please enter a number > 0'
    } else {
      error.value = ''
    }
  }
}

const sendAmount = async () => {
  await validateValue(amountValue.value)
  if (!error.value) {
    await $Blockchain.sendAmount(String(amountValue.value))
  }
}
</script>

<style lang="sass">
.invalid-feedback
  width: 100%
  margin-top: .25rem
  font-size: .875em
  color: #dc3545
</style>