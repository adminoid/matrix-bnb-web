<template lang="pug">
alerts

.container

  connect

  .row.frame
    .mb-3.row
      .fst-italic Withdraw 10% after year, then once of year
    .row
      button(
        type="button"
        class="btn btn-outline-danger"
        @click="withdrawTen"
        :disabled="disabled.status"
      ) Withdraw
.end-space
</template>

<script lang="ts" setup>
import { useNuxtApp } from '#app'
import { onMounted, nextTick } from 'vue'
import { useDisabled } from '~/composables/useDisabled'

const { $Blockchain } = useNuxtApp()
const disabled = useDisabled()

onMounted(async () => {
  await $Blockchain.init()
})

const withdrawTen = async () => {
  await nextTick(async () => {
    await $Blockchain.withdrawTen()
  })
}
</script>

<style lang="sass">
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
