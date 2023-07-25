<template lang="pug">
.row.frame
  .row
    .col.col-sm-3.mb-3
      label.col-form-label(for='matrix-level') Matrix level
    .col-sm-9.mb-3
      .input-group
        input#matrix-level.form-control.col-4(
          type='number' min="0" step="1"
          v-model="userMatrixLevel"
          :disabled="disabled.status"
          required
        )

  .mb-3.row
    .col.col-sm-3.mb-3
      label.col-form-label(for='user-matrix') User index
    .col-sm-9.mb-3
      .input-group
        input#user-matrix.form-control.col-4(
          type='text'
          v-model="userMatrixAddress"
          :class="{'is-invalid': !!error}"
          :disabled="disabled.status"
          required
        )
        .invalid-feedback {{ error }}

  .row
    button(
      type="button"
      class="btn btn-outline-warning"
      @click="getMatrixUser"
      :disabled="disabled.status"
    ) Get Matrix user
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import { useDisabled } from '~/composables/useDisabled'
import Web3 from 'web3'

const disabled = useDisabled()
const { $Blockchain } = useNuxtApp()

const userMatrixLevel = ref('0')

const userMatrixAddress = ref('')

const error = ref('')
watch(userMatrixAddress, async (newValue) => {
  await validateValue(newValue)
})

const validateValue = async (value) => {
  const accounts = await $Blockchain.Web3.eth.getAccounts();
  if (!accounts || !$Blockchain.Wallet) {
    error.value = 'Please connect your wallet first'
  } else {
    if (!Web3.utils.isAddress(value)) {
      error.value = 'please enter valid ethereum address'
    } else {
      error.value = ''
    }
  }
}

const getMatrixUser = async () => {
  await validateValue(userMatrixAddress.value)
  if (!error.value) {
    await $Blockchain.getMatrixUser(userMatrixLevel.value, userMatrixAddress.value)
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