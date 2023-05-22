<template lang="pug">
alerts

.container

  connect

  ul.nav.nav-tabs.mt-2.mb-0
    li.nav-item
      NuxtLink.nav.nav-link(to="/") Write methods
    li.nav-item
      NuxtLink.nav.nav-link(to="/read") Read methods

router-view

.end-space

</template>

<script lang="ts" setup>
import { useNuxtApp } from '#app'
import { onMounted } from 'vue'
import { useDisabled } from '~/composables/useDisabled'

const { $Blockchain } = useNuxtApp()
const disabled = useDisabled()

onMounted(async () => {
  await $Blockchain.init()
})
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
  .router-link-exact-active
    color: var(--bs-nav-tabs-link-active-color)
    background-color: var(--bs-nav-tabs-link-active-bg)
    border-color: #0d6efd
    border-width: 2px
</style>
