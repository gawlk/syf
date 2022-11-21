import { average } from '/src/scripts'

export const sma = (values: number[], smoothing: number) => {
  smoothing = smoothing < 1 ? 1 : smoothing

  const SMA = []

  let start = 0

  while (!values[start]) {
    SMA.push(null)
    start++
  }

  SMA.push(...new Array(smoothing - 1).fill(null))

  start += smoothing - 1

  for (let i = start; i <= values.length - 1; i++) {
    SMA.push(average(values.slice(i - smoothing + 1, i + 1)))
  }

  return SMA
}
