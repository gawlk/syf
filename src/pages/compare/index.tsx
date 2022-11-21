import {
  computeAmountInvested,
  computeSimpleDCA,
  createAPI,
  currencies,
} from '/src/scripts'

import Assets from './components/assets/index'
import Chart from './components/chart'
import Frequency from './components/frequency'
import Interval, { defaultEnd, defaultStart } from './components/interval'
import Investment from './components/investment'
import Platforms from './components/platforms'
import Repartition from './components/repartition/index'

import Icon from '/src/components/icon'
import Label from '/src/components/label'
import Section from '/src/components/section'
import TextFromAsset from '/src/components/textFromAsset'

const findCurrency = (symbol: string) =>
  currencies.find((currency) => currency.symbol === symbol) || currencies[0]

export default () => {
  const api = createAPI()

  const createCategory = (kind: AssetKind, name: string): Category => {
    return {
      kind,
      name,
      assets: [],
      repartition: 0,
      fees: {
        flat: 0,
        percentage: 0,
      },
    }
  }

  const [state, setState] = createStore({
    investment: {
      currency: findCurrency('USD'),
      initial: 1000,
      recurrent: 100,
      isDateAnInvestmentDay: () => false,
    } as Investment,
    interval: {
      start: defaultStart,
      end: defaultEnd,
    } as Interval,
    categories: [
      createCategory('etf', 'ETFs'),
      createCategory('equity', 'Equities'),
      createCategory('crypto', 'Crypto assets'),
    ] as Category[],
  })

  const charts: ChartProps[] = [
    {
      series: [
        {
          kind: 'area',
          name: 'Price',
          compute: (parameters: ChartComputeParameters) =>
            parameters.asset.chart.map((data) => {
              return {
                date: data.date,
                value: data.price,
              }
            }),
        },
      ],
      options: {},
    },
    {
      series: [
        {
          kind: 'area',
          name: 'Simple DCA',
          compute: computeSimpleDCA,
        },
        {
          kind: 'area',
          name: 'Investment',
          compute: computeAmountInvested,
        },
      ],
      options: {},
    },
  ]

  return (
    <div class="min-h-full md:flex md:max-h-screen">
      <div class="w-full min-w-0 flex-1 space-y-12 p-6 md:max-w-[620px] md:overflow-y-auto">
        <Investment
          investment={state.investment}
          setter={(key: keyof Investment, value?: string) =>
            value !== undefined &&
            setState(
              'investment',
              key,
              key === 'currency' ? findCurrency(value) : Number(value)
            )
          }
        />
        <Frequency
          setter={(isDateAnInvestmentDay: IsDateAnInvestmentDay) =>
            setState('investment', {
              isDateAnInvestmentDay,
            })
          }
        />
        <Interval
          setter={(start: Date, end: Date) =>
            setState('interval', {
              start,
              end,
            })
          }
        />
        <Assets
          categories={state.categories}
          setter={(kind: AssetKind, assets: Asset[]) => {
            setState(
              'categories',
              (category) => category.kind === kind,
              'assets',
              assets
            )

            assets.forEach(async (asset, index) => {
              if (!asset.chart.length) {
                setState(
                  'categories',
                  (category) => category.kind === kind,
                  'assets',
                  index,
                  {
                    chart: await api.fetchAssetMarketChart(asset),
                  }
                )
              }
            })
          }}
        />
        <Repartition
          categories={state.categories}
          setter={(object: Category | Asset, repartition: number) => {
            if ('assets' in object) {
              setState(
                'categories',
                (_category) => _category.kind === object.kind,
                'repartition',
                repartition
              )
            } else {
              setState(
                'categories',
                (_category) => _category.kind === object.kind,
                'assets',
                (_asset) => _asset.name === object.name,
                'repartition',
                repartition
              )
            }
          }}
        />
        <Platforms
          currency={state.investment.currency}
          categories={state.categories}
          setter={(category: Category, key: keyof Fees, value: number) =>
            setState(
              'categories',
              (_category) => _category.kind === category.kind,
              'fees',
              key,
              value
            )
          }
        />
      </div>
      <div class="hidden w-full min-w-0 flex-1 space-y-12 p-6 md:block md:overflow-y-auto">
        <For each={state.categories}>
          {(category) => (
            <Show when={category.assets.length}>
              <Section id={`${category.name}-charts`} title={category.name}>
                <For each={category.assets}>
                  {(asset) => (
                    <Label
                      label={
                        <div class="flex items-center space-x-2">
                          <Icon icon={asset.icon} rgb={asset.rgb} />
                          <TextFromAsset asset={asset} />
                        </div>
                      }
                    >
                      <For each={charts}>
                        {(chart, index) => (
                          <Chart
                            {...chart}
                            asset={asset}
                            interval={state.interval}
                            investment={state.investment}
                            fees={category.fees}
                            last={index() === charts.length - 1}
                          />
                        )}
                      </For>
                    </Label>
                  )}
                </For>
                <Show when={category.assets.length > 1}>
                  <Label label="All">Chart</Label>
                </Show>
              </Section>
            </Show>
          )}
        </For>
        <Show
          when={
            state.categories.filter(
              (category) => category.repartition && category.assets.length > 0
            ).length > 1
          }
        >
          <Section id="all-charts" title="All combined">
            <div>Chart</div>
          </Section>
        </Show>
      </div>
    </div>
  )
}
