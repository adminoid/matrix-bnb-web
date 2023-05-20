import { useNuxtApp } from "#app"
import { TDisabled } from '~/types'

export function useDisabled() {
  // state encapsulated and managed by the composable
  let disabled = ref({ cause: '', status: false})

  // a composable can update its managed state over time.
  function update(disableObject) {
    disabled.value = disableObject
  }

  useNuxtApp().$on('disabled', (disabledObj: TDisabled) => {
    update(disabledObj)
  })

  return disabled
}