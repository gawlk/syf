declare namespace LightweightCharts {
  export type IChartApi = import('lightweight-charts').IChartApi
  export type ISeriesApi<T> = import('lightweight-charts').ISeriesApi<T>
  export type IPriceLine = import('lightweight-charts').IPriceLine
  export type ChartOptions = import('lightweight-charts').ChartOptions
  export type DeepPartial<T> = import('lightweight-charts').DeepPartial<T>
  export type SeriesOptionsCommon =
    import('lightweight-charts').SeriesOptionsCommon
  export type AreaStyleOptions = import('lightweight-charts').AreaStyleOptions
  export type BarStyleOptions = import('lightweight-charts').BarStyleOptions
  export type BaselineStyleOptions =
    import('lightweight-charts').BaselineStyleOptions
  export type CandlestickStyleOptions =
    import('lightweight-charts').CandlestickStyleOptions
  export type HistogramStyleOptions =
    import('lightweight-charts').HistogramStyleOptions
  export type LineStyleOptions = import('lightweight-charts').LineStyleOptions
  export type SingleValueData = import('lightweight-charts').SingleValueData
  export type WhitespaceData = import('lightweight-charts').WhitespaceData
}

interface ChartData {
  date: Date
  value: number
}

interface ChartComputeParameters {
  asset: Asset
  interval: Interval
  investment: Investment
  fees: Fees
}

interface ChartProps {
  options: LightweightCharts.DeepPartial<LightweightCharts.ChartOptions>
  series: {
    kind: 'area' | 'bar' | 'baseline' | 'candlestick' | 'histogram' | 'line'
    name: string
    compute: (parameters: ChartComputeParameters) => ChartData[]
    options?: LightweightCharts.DeepPartial<
      (
        | LightweightCharts.AreaStyleOptions
        | LightweightCharts.BarStyleOptions
        | LightweightCharts.BaselineStyleOptions
        | LightweightCharts.CandlestickStyleOptions
        | LightweightCharts.HistogramStyleOptions
        | LightweightCharts.LineStyleOptions
      ) &
        LightweightCharts.SeriesOptionsCommon
    >
  }[]
  small?: boolean
}
