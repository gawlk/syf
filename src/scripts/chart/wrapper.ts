import {
  createChart,
  type IChartApi,
  type DeepPartial,
  type ChartOptions,
} from 'lightweight-charts'

export const createChartWrapper = (parameters: {
  element: HTMLDivElement
  parentElement: HTMLDivElement
  height: number
  options: DeepPartial<ChartOptions>
  onDone: (chart: IChartApi) => void
}) => {
  let observer: IntersectionObserver | undefined

  const [chart, setChart] = createSignal(undefined as IChartApi | undefined)

  const chartWrapper = {
    chart,
    resize: function () {
      const chart = this.chart()

      if (chart) {
        const chartDimensions = computeChartDimensions()

        chart.resize(chartDimensions.width, chartDimensions.height)

        chart.timeScale().fitContent()
      }
    },
    remove: function () {
      this.chart()?.remove()

      setChart(undefined)
    },
    clean: function () {
      this.remove()

      observer?.disconnect()

      observer = undefined
    },
  }

  const computeChartDimensions = () => {
    return {
      width: parameters.parentElement.clientWidth + 1,
      height: parameters.height,
    }
  }

  observer = new IntersectionObserver(
    (entries) => {
      const isIntersecting = entries[0].isIntersecting

      if (isIntersecting) {
        const chart = createChart(parameters.element, {
          ...parameters.options,
          ...computeChartDimensions(),
        })

        setChart(chart)

        parameters.onDone(chart)
      } else {
        chartWrapper.remove()
      }
    },
    {
      rootMargin: '25%',
    }
  )

  observer.observe(parameters.parentElement)

  return chartWrapper
}
