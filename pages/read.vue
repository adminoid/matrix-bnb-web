<template lang="pug">
.container.mt-0
  panel-get-core-user
  panel-get-matrix-user
  panel-get-matrix-user-by-id
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useNuxtApp } from '#app'

const { $Blockchain } = useNuxtApp()
onMounted(async () => {
  $Blockchain.Nuxt.$emit('connect-update')
})
</script>
