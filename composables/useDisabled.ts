import { useNuxtApp } from "#app"
import { TDisabled } from '~/types'
import { nextTick } from 'vue'

export function useDisabled() {
  // state encapsulated and managed by the composable
  let disabled = ref({ cause: '', status: false})

  // a composable can update its managed state over time.
  async function update(disableObject) {
    await nextTick(() => {
      disabled.value = disableObject
    })
  }

  useNuxtApp().$on('disabled', async (disabledObj: TDisabled) => {
    await update(disabledObj)
  })

  return disabled
}