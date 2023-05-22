<template lang="pug">
.container
  panel-whose
  panel-withdraw
  panel-send-amount
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useNuxtApp } from '#app'

const { $Blockchain } = useNuxtApp()
onMounted(async () => {
  $Blockchain.Nuxt.$emit('connect-update')
})
</script>
