export const createBaseAPI = (parameters: BaseAPIParameters): BaseAPI => {
  const state: BaseAPIState = {
    timeoutQueue: [],
  }

  return {
    baseUrl: parameters.baseUrl,
    fetch: async function (path: string, signal?: AbortSignal) {
      while (state.timeoutQueue.length > (parameters.rate?.max || 50)) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      const timeoutId = setTimeout(() => {
        const index = state.timeoutQueue.findIndex(
          (_timeoutId) => _timeoutId === timeoutId
        )

        index !== -1 && state.timeoutQueue.splice(index, 1)
      }, parameters.rate?.timeout || 30000) as unknown as number

      state.timeoutQueue.push(timeoutId)

      return fetch(`${parameters.baseUrl}${path}`, { signal })
    },
    fetchText: async function (path: string, signal?: AbortSignal) {
      return (await this.fetch(path, signal)).text()
    },
    fetchJSON: async function <T>(path: string, signal?: AbortSignal) {
      return (await this.fetch(path, signal)).json() as Promise<T>
    },
  }
}
