export const getIchimoku = (
  highs: number[],
  lows: number[],
  conversionPeriods = 9,
  basePeriods = 26,
  laggingSpan2Periods = 52,
  displacement = 26
) => {
  const conversionLine = new Array(conversionPeriods - 1).fill(null)
  const baseLine = new Array(basePeriods - 1).fill(null)
  const leadingLine1 = new Array(basePeriods - 1 + displacement).fill(null)
  const leadingLine2 = new Array(laggingSpan2Periods - 1 + displacement).fill(
    null
  )

  const periodsHighsLows = (i: number, period: number) =>
    (Math.max(...highs.slice(i - period, i + 1)) +
      Math.min(...lows.slice(i - period, i + 1))) /
    2

  if (highs.length > leadingLine2.length) {
    for (let i = conversionPeriods - 1; i < highs.length; i++) {
      conversionLine.push(periodsHighsLows(i, conversionPeriods - 1))

      if (i >= basePeriods - 1) {
        baseLine.push(periodsHighsLows(i, basePeriods - 1))

        leadingLine1.push((conversionLine[i] + baseLine[i]) / 2)

        if (i >= laggingSpan2Periods - 1) {
          leadingLine2.push(periodsHighsLows(i, laggingSpan2Periods - 1))
        }
      }
    }
  }

  return {
    conversionLine,
    baseLine,
    leadingLine1,
    leadingLine2,
  }
}
