export const createBaseAPI = (parameters: BaseAPIParameters): BaseAPI => {
  const state: BaseAPIState = {
    timeoutQueue: [],
  }

  return {
    fetch: async function <T>(path: string) {
      while (state.timeoutQueue.length > parameters.rate.max) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      const timeoutId = setTimeout(() => {
        const index = state.timeoutQueue.findIndex(
          (_timeoutId) => _timeoutId === timeoutId
        )

        index !== -1 && state.timeoutQueue.splice(index, 1)
      }, parameters.rate.timeout) as unknown as number

      state.timeoutQueue.push(timeoutId)

      return (await fetch(`${parameters.baseUrl}${path}`)).json() as Promise<T>
    },
  }
}
