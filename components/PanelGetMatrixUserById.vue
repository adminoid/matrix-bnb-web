<template lang="pug">
form.row.frame(@submit.prevent.stop="getCoreUserByMatrixPosition")
  .row
    .col.col-sm-3.mb-3
      label.col-form-label(for='matrix-level') Matrix index
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
          type='number' min="0" step="1"
          v-model="userMatrixIndex"
          :class="{'is-invalid': !!error}"
          :disabled="disabled.status"
          required
        )
        .invalid-feedback {{ error }}

  .row
    button(
      type="submit"
      class="btn btn-outline-warning"
      :disabled="disabled.status"
    ) Get Core User by matrix position
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import { useDisabled } from '~/composables/useDisabled'

const disabled = useDisabled()
const { $Blockchain } = useNuxtApp()

const userMatrixLevel = ref(0)

const userMatrixIndex = ref(0)

const error = ref('')
watch(userMatrixLevel, async (newValue) => {
  await validateValue(newValue)
})

const validateValue = async (value: any) => {
  const accounts = await $Blockchain.Web3.eth.getAccounts();
  if (!accounts || !$Blockchain.Wallet) {
    error.value = 'Please connect your wallet first'
  } else {
    if (value < 0 || value > 20) {
      error.value = 'please enter value between 0 and 20'
    } else {
      error.value = ''
    }
  }
}

const getCoreUserByMatrixPosition = async () => {
  await validateValue(userMatrixLevel.value)
  if (!error.value) {
    await $Blockchain.GetCoreUserByMatrixPosition(userMatrixLevel.value, userMatrixIndex.value)
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