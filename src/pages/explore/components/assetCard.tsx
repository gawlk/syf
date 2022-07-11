import { createResizeObserver } from '@solid-primitives/resize-observer'

import {
  createChartWrapper,
  convertIDToBackgroundColorProperty,
  applyColorOnArea,
  applyColorOnPriceLine,
  debounce,
} from '/src/scripts'

import Card from '/src/components/card'
import Pill from '/src/components/pill'
import Title from '/src/components/title'

interface Props {
  asset: SolidJS.DeepReadonly<CoinGeckoAssetMarketData | null>
}

export default (props: Props) => {
  const chartHeight = 128

  const [state, setState] = createStore({
    chartWrapper: undefined as ChartWrapper | undefined,
    hasIntersected: false,
    returnPercentage: 0,
  })

  let chartElement: HTMLDivElement | undefined
  let chartParentElement: HTMLDivElement | undefined
  let chartSeries: LightweightCharts.ISeriesApi<'Area'> | undefined
  let priceLine: LightweightCharts.IPriceLine | undefined

  const updateChart = () => {
    if (!props.asset || !state.chartWrapper?.chart || !chartSeries) {
      return undefined
    }

    const date = new Date()
    date.setDate(date.getDate() - 7)
    date.setHours(date.getHours() - 1)

    const prices = [
      ...props.asset.sparkline_in_7d.price,
      props.asset.current_price,
    ]

    const returnPercentage =
      prices.length > 1 ? ((prices.at(-1) as number) / prices[0] - 1) * 100 : 0

    setState('returnPercentage', returnPercentage)

    const data = prices.map((price) => {
      date.setHours(date.getHours() + 1)

      return { time: (date.valueOf() / 1000) as any, value: price }
    })

    chartSeries.setData(data)

    applyColorOnArea(chartSeries, {
      prices: data.map((price) => price.value),
    })

    if (priceLine) {
      priceLine.applyOptions({
        price: prices.at(0),
      })

      applyColorOnPriceLine(priceLine, {
        prices,
      })
    }

    state.chartWrapper?.chart()?.timeScale().fitContent()
  }

  createEffect(() => {
    if (props.asset) {
      updateChart()
    }
  })

  onMount(() => {
    if (chartElement && chartParentElement) {
      setState(
        'chartWrapper',
        createChartWrapper({
          element: chartElement,
          parentElement: chartParentElement,
          height: chartHeight,
          options: {
            timeScale: {
              visible: false,
            },
            handleScale: false,
            handleScroll: false,
            crosshair: {
              horzLine: {
                visible: false,
              },
              vertLine: {
                visible: false,
              },
            },
            leftPriceScale: {
              visible: false,
            },
            rightPriceScale: {
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
            layout: {
              backgroundColor: 'transparent',
            },
          },
          onDone: (chart: LightweightCharts.IChartApi) => {
            chartSeries = chart.addAreaSeries({
              lineWidth: 2,
              priceLineVisible: false,
              crosshairMarkerVisible: false,
            })

            priceLine = chartSeries.createPriceLine({
              price: 0,
              color: '',
              lineWidth: 2,
              lineStyle: 4,
              lineVisible: true,
              axisLabelVisible: false,
              title: 'Starting price',
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
    <Card
      url={`/assets/crypto/${props.asset?.id}`}
      style={convertIDToBackgroundColorProperty(props.asset?.id)}
      loading={!props.asset}
      class="bg-black bg-opacity-10 hover:brightness-95"
    >
      <div class="flex items-start justify-between">
        <div
          class={[
            !props.asset && 'opacity-0',
            'flex-1 -space-y-1 truncate px-2',
          ].join(' ')}
        >
          <Title level={4} class="truncate">
            {props.asset?.symbol.toUpperCase()}{' '}
            <span style="font-size: 0.8em" class="opacity-50">
              <span style="font-size: 0.9em" class="opacity-75">
                #
              </span>
              {props.asset?.market_cap_rank || '?'}
            </span>
          </Title>
          <Title level={6} class="truncate opacity-50">
            {props.asset?.name}
          </Title>
        </div>
        <div class="flex-none rounded-full border-4 border-black bg-white p-1">
          <img
            src={props.asset?.image}
            loading="lazy"
            class={[
              props.asset?.image ? 'opacity-100' : 'opacity-0',
              'flex-0 h-12 w-12 rounded-full bg-white object-contain transition-opacity duration-200',
            ].join(' ')}
          />
        </div>
      </div>
      <div
        ref={chartParentElement}
        style={`height: ${chartHeight}px`}
        class="relative -mx-4 -mt-[0.875rem] -mb-2"
      >
        <div class="transition-opacity duration-200 group-hover:opacity-50">
          <div ref={chartElement} />
        </div>
        <div class="absolute inset-y-0 right-0 z-20 flex items-center p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <IconTablerArrowRight class="h-12 w-12" />
        </div>
      </div>
      <div
        class={[
          !props.asset && 'opacity-0',
          'flex items-end justify-between',
        ].join(' ')}
      >
        <Pill
          green={state.returnPercentage > 0}
          red={state.returnPercentage < 0}
          class="flex-0"
        >
          {state.returnPercentage.toLocaleString('en', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          <span style="font-size: 0.8em" class="opacity-75">
            %
          </span>
        </Pill>
        <div class="flex-1 -space-y-1 truncate px-2 text-right">
          <Title level={4} class="truncate">
            <span style="font-size: 0.8em" class="opacity-50">
              $
            </span>
            {Math.floor(props.asset?.current_price || 0).toLocaleString('en')}.
            {() => {
              const fraction =
                String(props.asset?.current_price).split('.')[1] || ''

              return '0'.repeat(Math.max(2 - fraction.length, 0)) + fraction
            }}
          </Title>
          <Title level={6} class="truncate opacity-50">
            <span style="font-size: 0.8em" class="opacity-75">
              $
            </span>
            {props.asset?.market_cap?.toLocaleString('en') || '?'}
          </Title>
        </div>
      </div>
    </Card>
  )
}
