import { createResizeObserver } from '@solid-primitives/resize-observer'

import { createChartWrapper, ema, debounce } from '/src/scripts'
import { fetchDataset } from './scripts'

import MaxWidth2Screen from '/src/components/maxWidth2Screen'
import TitlePage from '/src/components/titlePage'
import Title from '/src/components/title'

interface Line {
  ma: (dataset: DataLine[], period: number) => DataLine[]
  period: number
  multiplier: number
  dataset: DataLine[]
  color?: string
}

export default () => {
  const chartHeight = Math.round(window.innerHeight * 0.65)

  const [searchParams, setSearchParams] = useSearchParams()

  const [state, setState] = createStore({
    chartWrapper: undefined as ChartWrapper | undefined,
    chartWrapper2: undefined as ChartWrapper | undefined,
    parameters: {
      ma: ema,
      period: 55,
      dates: {
        start: '2018/12/15',
        // end: undefined,
        end: '2018/12/19',
      },
      investment: {
        initial: 3000,
        recurrent: 0,
      },
      fees: {
        flat: 0,
        makers: 0.0026,
        takers: 0.0016,
      },
    },
  })

  let chartElement: HTMLDivElement | undefined
  let chartElement2: HTMLDivElement | undefined
  let chartParentElement: HTMLDivElement | undefined
  let chartParentElement2: HTMLDivElement | undefined

  const lines: Line[] = [
    1.2, 1.1875, 1.175, 1.1625, 1.15, 1.1375, 1.125, 1.1125, 1.1, 1.0875, 1.075,
    1.0625, 1.05, 1.0375, 1.025, 1.0125, 1, 0.9875, 0.975, 0.9625, 0.95, 0.9375,
    0.925, 0.9125, 0.9, 0.8875, 0.875, 0.8625, 0.85, 0.8375, 0.825, 0.8125, 0.8,
  ].map((percentage) => {
    return {
      ma: state.parameters.ma,
      period: state.parameters.period,
      multiplier: percentage,
      dataset: [],
      timesVisited: 0,
    }
  })

  const computeLinesDatasets = (dataset: DataCSV[]) => {
    lines.forEach((line) => {
      const ma = line.ma(
        dataset.map((data) => {
          return {
            time: data.time,
            value: data.close,
          }
        }),
        line.period
      )

      line.dataset = [
        { ...ma[0] },
        ...ma.map((data) => {
          return {
            time: data.time + 86400,
            value: data.value * line.multiplier,
          }
        }),
      ]
    })
  }

  const sliceDatasets = (datasets: (DataCSV[] | DataLine[])[]) => {
    const start = new Date(state.parameters.dates.start + ' GMT')
    const end = new Date(state.parameters.dates.end + ' GMT')

    datasets.forEach((dataset) => {
      dataset.splice(
        0,
        dataset.findIndex((data) => new Date(data.time * 1000) >= start)
      )

      dataset.splice(
        dataset.findIndex((data) => new Date(data.time * 1000) > end)
      )
    })
  }

  const getFirstLine = (dataset: DataCSV[]) =>
    lines
      .map((line) => {
        const lineValue = line.dataset[0].value
        return {
          line,
          value: Math.abs(dataset[0].open - lineValue),
        }
      })
      .reduce((previous, current) =>
        previous
          ? previous.value > current.value
            ? current
            : previous
          : current
      ).line

  const splitLinesInTwoGroups = (
    lastLineVisited: Line,
    value: number,
    index?: number
  ) => {
    const higherLines = [...lines.filter((line) => line !== lastLineVisited)]
    const lowerLines = higherLines.splice(
      higherLines.findIndex((line) => {
        const lineValue = line.dataset.at(index ?? -1)?.value
        return lineValue && lineValue <= value
      })
    )
    return { higherLines, lowerLines }
  }

  onMount(() => {
    const dataset = fetchDataset()

    computeLinesDatasets(dataset)

    sliceDatasets([dataset, ...lines.map((line) => line.dataset)])

    let lastLineVisited = getFirstLine(dataset)

    let currentInvestmentAmount = state.parameters.investment.initial
    let currentAssetAmount = 0

    const computePositions = (value: number, index: number) => {
      let { higherLines, lowerLines } = splitLinesInTwoGroups(
        lastLineVisited,
        value,
        index
      )

      const totalInvestmentAmount =
        currentInvestmentAmount + value * currentAssetAmount

      const numberOfSellOrders = higherLines.length
      const numberOfBuyOrders = lowerLines.length
      const numberOfPossibleOrders = numberOfSellOrders + numberOfBuyOrders

      const investmentAmountPerOrder =
        totalInvestmentAmount / numberOfPossibleOrders

      currentInvestmentAmount = investmentAmountPerOrder * numberOfBuyOrders
      currentAssetAmount =
        (investmentAmountPerOrder * numberOfSellOrders) / value
      const currentTotalInvestment =
        currentInvestmentAmount + currentAssetAmount * value
      const currentTotalAsset =
        currentAssetAmount + currentInvestmentAmount / value

      console.log({
        time: dataset[index].date,
        currentInvestmentAmount,
        currentAssetAmount,
        currentTotalInvestment,
        currentTotalAsset,
      })
    }

    computePositions(dataset[0].open, 0)

    dataset.forEach((data, index) => {
      const isUp = data.close > data.open
      const top = isUp ? data.close : data.open
      const bottom = isUp ? data.open : data.close

      const lineCrossFilter = (min: number, max: number) => (line: Line) => {
        const value = line.dataset[index].value
        return value && value >= min && value <= max
      }

      const linesCrossingWickUp = lines.filter(lineCrossFilter(top, data.high))
      const linesCrossingWickDown = lines.filter(
        lineCrossFilter(data.low, bottom)
      )
      const linesCrossingBody = lines.filter(lineCrossFilter(bottom, top))

      let linesCrossedInOrder: Line[] = []

      if (isUp) {
        linesCrossedInOrder.push(
          ...linesCrossingWickDown,
          ...[...linesCrossingWickDown].reverse().slice(1),
          ...[...linesCrossingBody].reverse(),
          ...[...linesCrossingWickUp].reverse(),
          ...linesCrossingWickUp.slice(1)
        )
      } else {
        linesCrossedInOrder.push(
          ...[...linesCrossingWickUp].reverse(),
          ...linesCrossingWickUp.slice(1),
          ...linesCrossingBody,
          ...linesCrossingWickDown,
          ...[...linesCrossingWickDown].reverse().slice(1)
        )
      }

      console.log(linesCrossedInOrder)

      linesCrossedInOrder.forEach((line) => {
        computePositions(line.dataset[index].value, index)
      })

      const last = linesCrossedInOrder.at(-1)
      last && (lastLineVisited = last)

      lines.forEach((line) => {
        const lineData = line.dataset[index]
        if (lineData.value) {
          lineData.color =
            line === lastLineVisited
              ? 'transparent'
              : linesCrossedInOrder.includes(line)
              ? '#ffc300'
              : data.close > lineData.value
              ? '#26a69a'
              : '#ef5350'
        }
      })
    })

    if (
      chartElement &&
      chartElement2 &&
      chartParentElement &&
      chartParentElement2
    ) {
      setState(
        'chartWrapper',
        createChartWrapper({
          element: chartElement,
          parentElement: chartParentElement,
          height: chartHeight,
          options: {
            layout: {
              backgroundColor: 'transparent',
            },
            crosshair: {
              mode: 0,
            },
          },
          onDone: (chart: LightweightCharts.IChartApi) => {
            lines.map((line) => {
              chart
                .addLineSeries({
                  color: line.color,
                  lineWidth: 2,
                })
                .setData(
                  // @ts-ignore next-line
                  line.dataset
                )
            })

            const candlestickSeries = chart.addCandlestickSeries({
              upColor: '#26a69a',
              downColor: '#ef5350',
              wickUpColor: '#26a69a',
              wickDownColor: '#ef5350',
            })

            // @ts-ignore next-line
            candlestickSeries.setData(dataset)
          },
        })
      )

      setState(
        'chartWrapper2',
        createChartWrapper({
          element: chartElement2,
          parentElement: chartParentElement2,
          height: chartHeight,
          options: {
            layout: {
              backgroundColor: 'transparent',
            },
            crosshair: {
              mode: 0,
            },
          },
          onDone: (chart: LightweightCharts.IChartApi) => {
            const quantity =
              state.parameters.investment.initial / (dataset.at(0)?.open || 1)

            chart
              .addLineSeries({
                color: '#f79d65',
                lineWidth: 2,
              })
              .setData(
                dataset.map((data) => {
                  return {
                    time: data.time as any,
                    value: data.close * quantity,
                  }
                })
              )

            const asset1Quantity =
              state.parameters.investment.initial / (dataset.at(0)?.close || 1)
            const asset2Quantity =
              state.parameters.investment.initial / (dataset.at(0)?.close || 1)

            chart
              .addLineSeries({
                color: '#000',
                lineWidth: 2,
              })
              .setData(
                dataset.map((data) => {
                  return {
                    time: data.time as any,
                    value: data.close * asset1Quantity,
                  }
                })
              )
          },
        })
      )
    }
  })

  createResizeObserver(
    () => document.body,
    debounce(() => {
      state.chartWrapper?.resize()
      state.chartWrapper2?.resize()
    })
  )

  onCleanup(() => {
    state.chartWrapper?.clean()
    state.chartWrapper2?.clean()
  })

  return (
    <MaxWidth2Screen class="py-8">
      <TitlePage />
      <Title level={2} margin>
        Parameters
      </Title>
      <Title level={2} margin>
        Prices
      </Title>
      <div
        ref={chartParentElement}
        style={`height: ${chartHeight}px`}
        class="-mt-12"
      >
        <div ref={chartElement} />
      </div>
      <Title level={2} margin>
        Returns
      </Title>
      <div
        ref={chartParentElement2}
        style={`height: ${chartHeight}px`}
        class="-mt-12"
      >
        <div ref={chartElement2} />
      </div>
    </MaxWidth2Screen>
  )
}
