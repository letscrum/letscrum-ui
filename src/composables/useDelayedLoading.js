import { onBeforeUnmount, ref } from 'vue'

export function useDelayedLoading(options = {}) {
  const delay = options.delay ?? 180
  const minDuration = options.minDuration ?? 160
  const pending = ref(false)
  const loading = ref(false)
  const ready = ref(false)
  const error = ref(null)

  let timer
  let runId = 0
  let loadingShownAt = 0
  let disposed = false

  async function run(operation) {
    const currentRun = ++runId
    clearTimeout(timer)
    pending.value = true
    error.value = null

    timer = setTimeout(() => {
      if (!disposed && currentRun === runId && pending.value) {
        loading.value = true
        loadingShownAt = Date.now()
      }
    }, delay)

    try {
      return await operation()
    } catch (requestError) {
      if (currentRun === runId) error.value = requestError
      throw requestError
    } finally {
      if (disposed || currentRun !== runId) return

      clearTimeout(timer)
      const visibleFor = loadingShownAt ? Date.now() - loadingShownAt : 0
      const remaining = loading.value ? Math.max(0, minDuration - visibleFor) : 0
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining))
      }

      if (!disposed && currentRun === runId) {
        pending.value = false
        loading.value = false
        ready.value = true
        loadingShownAt = 0
      }
    }
  }

  function reset() {
    runId += 1
    clearTimeout(timer)
    pending.value = false
    loading.value = false
    ready.value = false
    error.value = null
    loadingShownAt = 0
  }

  onBeforeUnmount(() => {
    disposed = true
    clearTimeout(timer)
  })

  return {
    error,
    loading,
    pending,
    ready,
    reset,
    run
  }
}
