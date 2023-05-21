<template lang="pug">
.row.frame.frame_no-top
  .mb-3.row
    .col.col-sm-3.mb-3
      label.col-form-label(for='user-core') Get Core user
    .col-sm-9.mb-3
      .input-group
        input#user-core.form-control.col-4(
          type='text'
          :class="{'is-invalid': !!error}"
          v-model="userCoreAddress"
          :disabled="disabled.status"
          required
        )
        .invalid-feedback {{ error }}
  .row
    button(
      type="button"
      class="btn btn-outline-warning"
      @click="getCoreUser"
      :disabled="disabled.status"
    ) Get Core user
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import { useDisabled } from '~/composables/useDisabled'
import Web3 from 'web3'

const disabled = useDisabled()
const { $Blockchain } = useNuxtApp()

const userCoreAddress = ref('')

const error = ref('')
watch(userCoreAddress, async (newValue) => {
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

const getCoreUser = async () => {
  await validateValue(userCoreAddress.value)
  if (!error.value) {
    await $Blockchain.getCoreUser(userCoreAddress.value)
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