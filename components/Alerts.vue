<template lang="pug">
.alerts(v-if="alerts && alerts.length > 0")
  .row
    .alert(
      v-for="(alert, index) in alerts"
      :class="'alert-'+alert.type+' d-flex'"
      role="alert"
    )
      svg(
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
        viewBox="0 0 16 16"
        role="img"
        aria-label="Warning:"
      )
        path(
          :d="getPathByAlertType(alert.type)"
        )
      pre {{ alert.num }}) {{ alert.message }}
      button(
        style="margin-left: auto"
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="closeAlert(index)"
      )
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import type { TAlert } from '~/types'

const props = defineProps({
  alerts: {
    type: Array as PropType<TAlert[]>
  },
})
const alerts = ref([])
const closeAlert = (index) => {
  alerts.value.splice(index, 1);
}
const { $on } = useNuxtApp()
$on('alert', ({type, message}) => {
  alerts.value.push({num: alerts.value.length, type, message})
})
const getPathByAlertType = (type) => {
  switch (type) {
    case 'success':
      return "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
    case 'primary':
      return "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
    case 'warning':
      return "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
    case 'danger':
      return "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
  }
}
</script>

<style lang="sass">
.alerts
  position: fixed
  bottom: 20px
  right: 20px
  opacity: .7
  width: 325px
  z-index: 100
  .alert
    border-color: #0a53be
    padding: 5px
    pre
      padding-bottom: 15px
      margin-bottom: 0
</style>