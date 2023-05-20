<template lang="pug">
alerts

.container

  connect

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

  panel-whose

  panel-withdraw

  panel-get-core-user

  //.row.frame
  //  .mb-3.row
  //    .col.col-sm-3.mb-3
  //      label.col-form-label(for='user-core') Get Core user
  //    .col-sm-9.mb-3
  //      .input-group
  //        input#user-core.form-control.col-4(
  //          type='text'
  //          v-model="userCoreAddress"
  //          :disabled="disabled.status"
  //        )
  //  .row
  //    button(
  //      type="button"
  //      class="btn btn-outline-warning"
  //      @click="getCoreUser"
  //      :disabled="disabled.status"
  //    ) Get Core user

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
        @click="$Blockchain.withdrawTen"
        :disabled="disabled.status"
      ) Withdraw

.end-space

</template>

<script lang="ts" setup>
import { useNuxtApp } from '#app'
import { ref, onMounted } from 'vue'
import Alerts from '~/components/Alerts.vue'
import Connect from '~/components/Connect.vue'
import PanelWhose from '~/components/PanelWhose.vue'
import PanelWithdraw from '~/components/PanelWithdraw.vue'

const { $Blockchain } = useNuxtApp()

onMounted(async () => {
  await $Blockchain.init()
})

let disabled = ref({cause: '', status: false})

const sendBnbAmount = ref('')

// const userCoreAddress = ref('')
// const getCoreUser = async () => {
//   await $Blockchain.getCoreUser(userCoreAddress.value)
// }

const userMatrixLevel = ref('')
const userMatrixAddress = ref('')
const getMatrixUser = async () => {
  await $Blockchain.getMatrixUser(userMatrixLevel.value, userMatrixAddress.value)
}

const sendBnb = async () =>
    (await $Blockchain.sendBnb(sendBnbAmount.value))

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
