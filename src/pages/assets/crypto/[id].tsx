import { createResizeObserver } from '@solid-primitives/resize-observer'

import {
  applyColorOnArea,
  applyColorOnHistogram,
  applyColorOnPriceLine,
  convertStringToBackgroundColorProperty,
  createChartWrapper,
  createCoinGeckoAPI,
  debounce,
} from '/src/scripts'

import Button from '/src/components/button'
import Card from '/src/components/card'
import Footer from '/src/components/footer'
import Link from '/src/components/link'
import MaxWidth2Screen from '/src/components/maxWidth2Screen'
import Title from '/src/components/title'

interface LegendData {
  price?: number
  date?: Date
  volume?: number
}

export default () => {
  const chartHeight = window.innerHeight * 0.65

  const api = createCoinGeckoAPI()

  const params = useParams()

  const backgroundColor = convertStringToBackgroundColorProperty(params.id)
  const defaultLegendDate = 'Now'
  const defaultLegendPrice = '?'
  const defaultLegendVolume = '?'

  const [state, setState] = createStore({
    chartWrapper: undefined as ChartWrapper | undefined,
    asset: {
      data: null as CoinGeckoAssetData | null,
      marketChart: null as CoinGeckoAssetMarketChart | null,
    },
    legend: {
      date: defaultLegendDate,
      price: defaultLegendPrice as string | number,
      volume: defaultLegendVolume as string | number,
    },
    currency: 'usd',
    interval: '',
  })

  let chartElement: HTMLDivElement | undefined
  let chartParentElement: HTMLDivElement | undefined
  let chartAreaSeries: LightweightCharts.ISeriesApi<'Area'> | undefined
  let priceLine: LightweightCharts.IPriceLine | undefined
  let chartHistogramSeries:
    | LightweightCharts.ISeriesApi<'Histogram'>
    | undefined

  const updateChart = () => {
    if (
      !state.asset.marketChart ||
      !state.chartWrapper?.chart ||
      !chartAreaSeries ||
      !chartHistogramSeries
    ) {
      return undefined
    }

    const convertTimestampValueTupleToObject = ([timestamp, value]: [
      number,
      number
    ]) => {
      return { time: (timestamp / 1000) as any, value }
    }

    const priceData = state.asset.marketChart.prices.map(
      convertTimestampValueTupleToObject
    )

    chartAreaSeries.setData(priceData)

    const prices = priceData.map((entry) => entry.value)

    applyColorOnArea(chartAreaSeries, {
      prices,
    })

    if (priceLine) {
      priceLine.applyOptions({
        price: prices.at(0),
      })

      applyColorOnPriceLine(priceLine, {
        prices,
      })
    }

    const volumeData = state.asset.marketChart.total_volumes.map(
      convertTimestampValueTupleToObject
    )

    chartHistogramSeries.setData(volumeData)

    const volumes = volumeData.map((entry) => entry.value)

    applyColorOnHistogram(chartHistogramSeries, {
      prices,
      volumes,
    })

    state.chartWrapper?.chart()?.timeScale().fitContent()
  }

  const updateLegend = (data?: LegendData) => {
    const currentPrice =
      data?.price ||
      state.asset.data?.market_data?.current_price[state.currency] ||
      defaultLegendPrice

    const currentVolume =
      data?.volume ||
      state.asset.data?.market_data?.total_volume[state.currency] ||
      defaultLegendVolume

    currentVolume &&
      setState('legend', {
        price: currentPrice,
        volume: currentVolume,
      })
  }

  onMount(async () => {
    const asset = await api.fetchAssetData({
      id: params.id,
      market_data: true,
    })

    setState('asset', 'data', asset)

    updateLegend()

    setState(
      'asset',
      'marketChart',
      await api.fetchAssetMarketChart({
        id: params.id,
        currency: 'usd',
        days: '7',
        interval: '',
      })
    )

    if (chartElement && chartParentElement) {
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
            handleScale: false,
            handleScroll: false,
            timeScale: {
              visible: false,
            },
            grid: {
              vertLines: {
                visible: false,
              },
              horzLines: {
                visible: false,
              },
            },
            leftPriceScale: {
              visible: false,
            },
            rightPriceScale: {
              visible: false,
            },
          },
          onDone: (chart: LightweightCharts.IChartApi) => {
            chartAreaSeries = chart.addAreaSeries({
              lineWidth: 2,
              priceLineVisible: false,
              baseLineVisible: true,
            })

            priceLine = chartAreaSeries.createPriceLine({
              price: 0,
              color: '',
              lineWidth: 2,
              lineStyle: 4,
              lineVisible: true,
              axisLabelVisible: false,
              title: 'Starting price',
            })

            chartHistogramSeries = chart.addHistogramSeries({
              priceFormat: {
                type: 'volume',
              },
              priceLineVisible: false,
              priceScaleId: '',
              scaleMargins: {
                top: 0.9,
                bottom: 0,
              },
            })

            chart.subscribeCrosshairMove((param) => {
              const data: LegendData = {}

              if (param.time) {
                data.date = new Date((param.time as number) * 1000)
              }

              if (chartAreaSeries) {
                console.log(param.seriesPrices.get(chartAreaSeries))

                data.price = Number(param.seriesPrices.get(chartAreaSeries))
              }

              if (chartHistogramSeries) {
                data.volume = Number(
                  param.seriesPrices.get(chartHistogramSeries)
                )
              }

              updateLegend(data)
            })

            updateChart()
          },
        })
      )
    }
  })

  createResizeObserver(
    () => document.body,
    debounce(() => {
      state.chartWrapper?.resize()
    })
  )

  onCleanup(() => {
    state.chartWrapper?.clean()
  })

  return (
    <div style={backgroundColor}>
      <div class="h-32" />
      <MaxWidth2Screen class="rounded-3xl bg-white">
        <div class="flex flex-col items-center justify-center space-y-2">
          <div class="-mt-[4.5rem] inline-block rounded-full bg-white p-2">
            <div class="rounded-full border-8 border-black bg-white p-2">
              <img
                src={state.asset.data?.image.large}
                loading="lazy"
                class={[
                  state.asset.data?.image.large ? 'opacity-100' : 'opacity-0',
                  'flex-0 h-24 w-24 rounded-full bg-white object-contain transition-opacity duration-200',
                ].join(' ')}
              />
            </div>
          </div>
          <div class="space-y-0.5 text-center">
            <Title level={1}>{state.asset.data?.name}</Title>
            <Title level={2} class="text-opacity-75">
              {state.asset.data?.symbol.toUpperCase()}
            </Title>
            <Title level={3} class="text-opacity-50">
              #{state.asset.data?.market_cap_rank}
            </Title>
          </div>
        </div>
        <div class="flex justify-between">
          <div class="z-10 bg-white">
            <Title level={2}>$ {state.legend.price}</Title>
          </div>
          <Link primary href={`/compare?assets=${state.asset.data?.id}`}>
            Compare
          </Link>
        </div>
        <div class="rounded-3xl border-8 border-black">
          <div
            ref={chartParentElement}
            style={`height: ${chartHeight}px`}
            class="-mt-12"
          >
            <div ref={chartElement} />
          </div>
        </div>
        <div class="flex justify-center space-x-1">
          <Button sm>1D</Button>
          <Button sm>1W</Button>
          <Button sm>1M</Button>
          <Button sm>3M</Button>
          <Button sm>1Y</Button>
          <Button sm>5Y</Button>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card style={backgroundColor} class="-hue-rotate-15">
            <div class="mx-2">
              <Title level={4} margin class="text-opacity-75">
                Description
              </Title>
              <p
                class="mb-1 text-black text-opacity-50 line-clamp-6"
                innerHTML={state.asset.data?.description.en}
              />
            </div>
          </Card>
          <Card style={backgroundColor}>
            <div class="mx-2">
              <Title level={4} margin class="text-opacity-75">
                Description
              </Title>
              <p
                class="mb-1 text-black text-opacity-50 line-clamp-6"
                innerHTML={state.asset.data?.description.en}
              />
            </div>
          </Card>
          <Card style={backgroundColor} class="hue-rotate-15">
            <div class="mx-2">
              <Title level={4} margin class="text-opacity-75">
                Description
              </Title>
              <p
                class="mb-1 text-black text-opacity-50 line-clamp-6"
                innerHTML={state.asset.data?.description.en}
              />
            </div>
          </Card>
        </div>
      </MaxWidth2Screen>
      <Footer />
    </div>
  )
}
