import { createResizeObserver } from '@solid-primitives/resize-observer'
import { createChart } from 'lightweight-charts'

import { debounce } from '/src/scripts'

const height = {
  normal: 300,
  small: 150,
}

interface Props extends ChartProps {
  asset: Asset
  interval: Interval
  investment: Investment
  fees: Fees
  last: boolean
}

export default (props: Props) => {
  const seriesList: LightweightCharts.ISeriesApi<
    'Area' | 'Histogram' | 'Line'
  >[] = []

  let chart: LightweightCharts.IChartApi | undefined
  let div: HTMLDivElement | undefined

  const resize = () => {
    if (chart) {
      const chartDimensions = computeChartDimensions()

      chart.resize(chartDimensions.width, chartDimensions.height)

      chart.timeScale().fitContent()
    }
  }

  const remove = () => {
    chart?.remove()
    chart = undefined
  }

  const computeChartDimensions = () => {
    return {
      width: div?.parentElement?.clientWidth || 0,
      height: div?.clientHeight || 0,
    }
  }

  createResizeObserver(() => document.body, debounce(resize))

  onMount(() => {
    if (div) {
      chart = createChart(div, {
        crosshair: {
          horzLine: {
            visible: false,
          },
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
        handleScale: false,
        handleScroll: false,
        leftPriceScale: {
          // visible: false,
          scaleMargins: { bottom: 0.025, top: 0.025 },
        },
        rightPriceScale: {
          // visible: false,
          scaleMargins: { bottom: 0.025, top: 0.025 },
        },
        timeScale: {
          minBarSpacing: 0.0001,
        },
        ...props.options,
        ...computeChartDimensions(),
      })

      createEffect(() => {
        chart?.applyOptions({
          timeScale: {
            visible: props.last ? true : false,
          },
        })
      })

      createEffect(() => {
        seriesList.forEach((series) => {
          chart?.removeSeries(series)
        })
        seriesList.length = 0

        props.series.forEach((parameters) => {
          if (parameters.kind === 'area') {
            const series = chart?.addAreaSeries({
              priceLineVisible: false,
              lineWidth: 2,
              ...parameters.options,
            })

            if (series) {
              seriesList.push(series)

              createEffect(() => {
                let start: number | undefined
                let end: number | undefined

                start = performance.now()
                const dataset = parameters
                  .compute({
                    asset: props.asset,
                    interval: props.interval,
                    investment: props.investment,
                    fees: props.fees,
                  })
                  .filter(
                    (data) =>
                      data.date >= props.interval.start &&
                      data.date <= props.interval.end
                  )
                  .map((data) => {
                    return {
                      time: (data.date.valueOf() / 1000) as unknown as string,
                      value: data.value,
                    }
                  })
                end = performance.now()
                console.log(
                  `Creating ${props.asset.symbol} ${
                    parameters.name
                  } dataset for chart took ${end - start}ms`
                )

                start = performance.now()
                series.setData(dataset)

                chart?.timeScale().fitContent()
                end = performance.now()
                console.log(
                  `Updating ${props.asset.symbol} ${
                    parameters.name
                  } chart took ${end - start}ms`
                )
              })
            }
          } else if (parameters.kind === 'line') {
          } else if (parameters.kind === 'histogram') {
          }
        })
      })
    }
  })

  onCleanup(() => {
    remove()
  })

  return (
    <div
      ref={div}
      style={{ height: `${props.small ? height.small : height.normal}px` }}
      class="border-b border-stone-300 last:border-b-0"
    />
  )
}
