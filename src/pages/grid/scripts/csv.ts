import { unixDateLength, removeObjectsWithSameKeyFromArray } from '/src/scripts'

import csvDaily from '/src/assets/data/btc-daily.csv?raw'
import csvHourly from '/src/assets/data/btc-hourly.csv?raw'

export const fetchDataset = () => {
  const csv = csvHourly

  const [head, ...rawDataset] = csv
    .split('\n')
    .filter((line) => line.includes(','))
    .map((line) => line.split(','))

  return removeObjectsWithSameKeyFromArray(
    rawDataset.reverse().map((valueList) => {
      let data: any = {}

      head.map((label, index) => {
        const value = valueList[index]
        data[label] = !isNaN(value as any) ? Number(value) : value
      })

      const length = String(data.unix).length

      data.date = new Date(`${data.date.replaceAll('-', '/')} GMT`)

      data.unix =
        new Date(data.unix * 10 ** (unixDateLength - length)).valueOf() / 1000

      data.time = data.unix

      return data as DataCSV
    }),
    'time'
  )
}
