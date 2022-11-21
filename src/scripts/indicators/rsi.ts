import { average } from '/src/scripts'

export const getRSI = (opens: number[], closes: number[], periods = 14) => {
  const RSI = new Array(periods - 1).fill(null)

  if (opens.length > periods && closes.length > periods) {
    const gains = []
    const losses = []

    for (let i = 0; i < periods; i++) {
      const result = (closes[i] / opens[i]) * 100 - 100

      gains.push(result > 0 ? result : 0)
      losses.push(result < 0 ? -result : 0)
    }

    let averageGain = average(gains)
    let averageLoss = average(losses)

    RSI.push(100 - 100 / (1 + averageGain / averageLoss))

    for (let i = periods; i < closes.length; i++) {
      const result = (closes[i] / opens[i]) * 100 - 100

      averageGain =
        (averageGain * (periods - 1) + (result > 0 ? result : 0)) / periods
      averageLoss =
        (averageLoss * (periods - 1) + (result < 0 ? -result : 0)) / periods

      RSI.push(100 - 100 / (1 + averageGain / averageLoss))
    }
  }

  return RSI
}
