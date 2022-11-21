export const getDefaultDebounceWaitBasedOnCallback = (
  callback: (...args: any[]) => void
) => (callback.constructor.name === 'AsyncFunction' ? 250 : 50)

export const debounce = (callback: (...args: any[]) => void, wait?: number) => {
  let timeoutId: number | undefined
  let latestArgs: any[] | undefined

  return (...args: any[]) => {
    latestArgs = args

    if (!timeoutId) {
      timeoutId = window.setTimeout(async () => {
        await callback.apply(null, latestArgs as [])

        timeoutId = undefined
      }, wait || getDefaultDebounceWaitBasedOnCallback(callback))
    }
  }
}
