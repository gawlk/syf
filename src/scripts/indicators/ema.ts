import { average } from '/src/scripts'

export const ema = (dataset: DataLine[], period: number) => {
  const emaDataset: DataLine[] = dataset.slice(0, period - 1).map((data) => {
    return {
      time: data.time,
      value: NaN,
    }
  })

  const smoothing = 2

  if (dataset.length >= period) {
    emaDataset.push({
      time: dataset[period - 1].time,
      value: average(dataset.slice(0, period).map((data) => data.value || 0)),
    })

    dataset.slice(period).forEach((data, index) => {
      emaDataset.push({
        time: data.time,
        value:
          ((data.value || 0) * smoothing) / (1 + period) +
          (emaDataset[index + period - 1].value || 1) *
            (1 - smoothing / (1 + period)),
      })
    })
  }

  return emaDataset
}
