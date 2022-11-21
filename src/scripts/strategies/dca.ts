export const computeSimpleDCA = (parameters: ChartComputeParameters) => {
  const dataset = parameters.asset.chart.filter(
    (data) =>
      data.date >= parameters.interval.start &&
      data.date <= parameters.interval.end
  )

  let quantity = parameters.investment.initial / (dataset.at(0)?.price || 0)

  return dataset.map((data, index) => {
    const price = data.price

    if (
      parameters.investment.isDateAnInvestmentDay(
        data.date,
        dataset[index - 1]?.date
      )
    ) {
      quantity += parameters.investment.recurrent / price
    }

    return {
      date: data.date,
      value: quantity * price,
    }
  })
}
