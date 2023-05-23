<template lang="pug">
.container
  panel-whose
  panel-send-amount
  panel-withdraw
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useNuxtApp } from '#app'

const { $Blockchain } = useNuxtApp()
onMounted(async () => {
  $Blockchain.Nuxt.$emit('connect-update')
})
</script>
