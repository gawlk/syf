interface BaseAPI {
  fetch: <T>(path: string) => Promise<T>
}

interface BaseAPIParameters {
  baseUrl: string
  rate: {
    max: number
    timeout: number
  }
}

interface BaseAPIState {
  timeoutQueue: number[]
}
