export const computeAmountInvested = (parameters: ChartComputeParameters) => {
  let investment = parameters.investment.initial

  return parameters.asset.chart
    .filter(
      (data) =>
        data.date >= parameters.interval.start &&
        data.date <= parameters.interval.end
    )
    .map((data, index, arr) => {
      if (
        parameters.investment.isDateAnInvestmentDay(
          data.date,
          arr[index - 1]?.date
        )
      ) {
        investment += parameters.investment.recurrent
      }

      return {
        date: data.date,
        value: investment,
      }
    })
}
