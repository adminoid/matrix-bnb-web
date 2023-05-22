<template lang="pug">
.container
  panel-get-core-user
  panel-get-matrix-user
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useNuxtApp } from '#app'

const { $Blockchain } = useNuxtApp()
onMounted(async () => {
  $Blockchain.Nuxt.$emit('connect-update')
})
</script>
