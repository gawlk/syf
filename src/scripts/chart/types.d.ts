declare namespace LightweightCharts {
  export type IChartApi = import('lightweight-charts').IChartApi
  export type ISeriesApi<T> = import('lightweight-charts').ISeriesApi<T>
  export type IPriceLine = import('lightweight-charts').IPriceLine
}

interface ChartWrapper {
  chart: SolidJS.Accessor<LightweightCharts.IChartApi | undefined>
  resize: () => void
  remove: () => void
  clean: () => void
}
