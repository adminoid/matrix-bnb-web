<template lang="pug">
alerts
.container

  .row.frame.border-success
    .row.mb-3(v-if="disabled.status")
      strong Awaiting {{ disabled.cause }}... &nbsp;
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

.container
  ul.nav.nav-tabs.mt-2
    li.nav-item
      a.nav-link.active(aria-current='page', href='#') Active
    li.nav-item
      a.nav-link(href='#') Link
    li.nav-item
      a.nav-link(href='#') Link
    li.nav-item
      a.nav-link.disabled Disabled

  .row.frame.frame_no-top
    .mb-3.row(v-if="registerWhoseAddr")
      .debug-panel {{ registerWhoseAddr }}
    .mb-3.row
      .col.col-sm-3.mb-3
        label.col-form-label(for='register-whose') Register whose
      .col-sm-9.mb-3
        .input-group
          input#register-whose.form-control.col-4(
            type='text'
            v-model="registerWhoseAddr"
            :disabled="disabled.status"
          )
    .row
      button(
        type="button"
        class="btn btn-outline-success"
        @click="registerWhose"
        :disabled="disabled.status"
      ) Register

  .row.frame
    .mb-3.row
      .col.col-sm-3.mb-3
        label.col-form-label(for='withdraw-claim') Withdraw claim (amount)
      .col-sm-9.mb-3
        .input-group
          input#withdraw-claim.form-control.col-4(
            type='text'
            v-model="withdrawClaimAmount"
            :disabled="disabled.status"
          )
    .row
      button(
        type="button"
        class="btn btn-outline-primary"
        @click="withdrawClaim"
        :disabled="disabled.status"
      ) Withdraw claim (amount)

  .row.frame
    .mb-3.row
      .col.col-sm-3.mb-3
        label.col-form-label(for='user-core') Get Core user
      .col-sm-9.mb-3
        .input-group
          input#user-core.form-control.col-4(
            type='text'
            v-model="userCoreAddress"
            :disabled="disabled.status"
          )
    .row
      button(
        type="button"
        class="btn btn-outline-warning"
        @click="getCoreUser"
        :disabled="disabled.status"
      ) Get Core user

  .row.frame
    .row
      .col.col-sm-3.mb-3
        label.col-form-label(for='user-matrix') User
      .col-sm-9.mb-3
        .input-group
          input#user-matrix.form-control.col-4(
            type='text'
            v-model="userMatrixAddress"
            :disabled="disabled.status"
          )
    .mb-3.row
      .col.col-sm-3.mb-3
        label.col-form-label(for='matrix-level') Matrix level
      .col-sm-9.mb-3
        .input-group
          input#matrix-level.form-control.col-4(
            type='text'
            v-model="userMatrixLevel"
            :disabled="disabled.status"
          )
    .row
      button(
        type="button"
        class="btn btn-outline-warning"
        @click="getMatrixUser"
        :disabled="disabled.status"
      ) Get Matrix user

  .row.frame
    .mb-3.row
      .fst-italic Same as just send bnb from wallet to contract address
    .mb-3.row
      .col.col-sm-3.mb-3
        label.col-form-label(for='send-bnb') Send BNB (amount)
      .col-sm-9.mb-3
        .input-group
          input#send-bnb.form-control.col-4(
            type='text'
            v-model="sendBnbAmount"
            :disabled="disabled.status"
          )
    .row
      button(
        type="button"
        class="btn btn-outline-danger"
        @click="sendBnb"
        :disabled="disabled.status"
      ) Send BNB (amount)

  .row.frame
    .mb-3.row
      .fst-italic Withdraw 10% after year, then once of year
    .row
      button(
        type="button"
        class="btn btn-outline-danger"
        @click="B.withdrawTen"
        :disabled="disabled.status"
      ) Withdraw

.end-space

</template>

<script lang="ts" setup>
// todo: create checking fields, not empty

import { useNuxtApp } from '#app'
import { ref, onMounted } from 'vue'
import { External } from '~/libs/blockchain/classes.ts'
import { getGlobalThis } from '@vue/shared'
import Alerts from '~/components/Alerts.vue'

const B = new External(useNuxtApp(), getGlobalThis())

const { $on } = useNuxtApp()

let disabled = ref({})
const registerWhoseAddr = ref('')
const sendBnbAmount = ref('')
const withdrawClaimAmount = ref('')

const userCoreAddress = ref('')
const getCoreUser = async () => {
  await B.getCoreUser(userCoreAddress.value)
}

const userMatrixLevel = ref('')
const userMatrixAddress = ref('')
const getMatrixUser = async () => {
  await B.getMatrixUser(userMatrixLevel.value, userMatrixAddress.value)
}

const connectedWallet = ref('')
const connectWallet = async () => {
  await B.connect()
  connectedWallet.value = B.Accounts[0]
}

onMounted(async () => {
  if (B.Accounts && B.Accounts.length > 0) connectedWallet.value = B.Accounts[0]

  if (B.Ethereum) {
    B.Ethereum.on("accountsChanged", async (accountsPassed) => {
      // Time to reload your interface with accounts[0]!
      const accounts = await B.Web3.eth.getAccounts();
      connectedWallet.value = accounts[0]
    })
  } else {
    disabled.value = {
      cause: 'Please install Metamask and reload the page',
      status: true,
    }
  }
})

const registerWhose = async () =>
    (await B.registerWhose(registerWhoseAddr.value))

const withdrawClaim = async () =>
    (await B.withdrawClaim(withdrawClaimAmount.value))

const sendBnb = async () =>
    (await B.sendBnb(sendBnbAmount.value))

$on('disabled', (payload: { cause: string, status: boolean }) => {
  // console.info('on disabled', payload)
  disabled.value = payload
})
</script>

<style lang="sass" scoped>
.container
  padding: 1em

.frame
  border: 2px solid lightgrey
  border-radius: 1em
  padding: 1em
  margin-top: 2em !important
  &.frame_no-top
    margin-top: 0 !important
  &_no-padding
    padding: 0
    border-color: rgba(10, 83, 190, 0.42)
    font-style: italic
.row
  margin: 0
.debug-panel
  font-size: 11px
  border: 1px dashed rgba(231, 66, 140, 0.51)
  border-radius: 2px
.end-space
  height: 800px
.spinner-border
  width: 20px
  height: 20px
  position: relative
  top: 3px
ul.nav.nav-tabs
  margin-bottom: 20px
</style>
