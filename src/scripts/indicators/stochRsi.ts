export const getStochRSI = (RSI: number[], periods = 14) => {
  const lastPeriods = []

  const stochRSI = new Array(periods - 1).fill(null)

  for (let i = periods - 1; i <= RSI.length - 1; i++) {
    if (lastPeriods.length === periods) {
      lastPeriods.shift()
    }

    const currentRSI = RSI[i]

    lastPeriods.push(currentRSI)

    const minRSI = Math.min(...lastPeriods)
    const maxRSI = Math.max(...lastPeriods)

    stochRSI.push(((currentRSI - minRSI) / (maxRSI - minRSI)) * 100)
  }

  return stochRSI
}
