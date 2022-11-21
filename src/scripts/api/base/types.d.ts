interface BaseAPI {
  baseUrl: string
  fetch: (path: string, signal?: AbortSignal) => Promise<Response>
  fetchText: (path: string, signal?: AbortSignal) => Promise<string>
  fetchJSON: <T>(path: string, signal?: AbortSignal) => Promise<T>
}

interface BaseAPIParameters {
  baseUrl: string
  rate?: {
    max: number
    timeout: number
  }
}

interface BaseAPIState {
  timeoutQueue: number[]
}
