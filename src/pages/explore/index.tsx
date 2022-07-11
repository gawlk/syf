import { createCoinGeckoAPI } from '/src/scripts'

import DialogSearch from '/src/components/dialogSearch'
import MaxWidth2Screen from '/src/components/maxWidth2Screen'
import Select from '/src/components/select'

import AssetCard from './components/assetCard'
import TabsCategories from './components/tabsCategories'

export default () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const api = createCoinGeckoAPI()

  const categoryAll: CoinGeckoCategoryMarketData = {
    id: '',
    name: 'All',
    market_cap: 0,
    content: '',
    top_3_coins: ['', '', ''],
  }

  const [state, setState] = createStore({
    mounted: false,
    assets: {
      currency: 'usd',
      pageIndex: 1,
      areAllFetched: false,
      perPage: 50,
      list: Array(20).fill(null) as (CoinGeckoAssetMarketData | null)[],
    },
    categories: {
      selected: categoryAll,
      presets: {
        all: categoryAll,
      },
      list: Array(20).fill(null) as (CoinGeckoCategoryMarketData | null)[],
    },
    search: {
      name: '',
      results: null as CoinGeckoSearchData | null,
    },
  })

  let observedElement: HTMLDivElement | undefined
  let observer: IntersectionObserver | undefined

  const updateCategoryAll = async (assets: CoinGeckoAssetMarketData[]) => {
    setState(
      'categories',
      'presets',
      'all',
      'top_3_coins',
      assets.slice(0, 3).map((asset) => asset?.image || '')
    )

    const globalData = await api.fetchGlobalData()

    setState(
      'categories',
      'presets',
      'all',
      'market_cap',
      globalData.data.total_market_cap[state.assets.currency]
    )
  }

  const fetchAssets = async () => {
    const id = state.categories.selected?.id

    const currentAssets =
      state.assets.pageIndex === 1 ? [] : [...state.assets.list]

    setState('assets', 'list', [
      ...currentAssets,
      ...new Array(state.assets.perPage).fill(null),
    ])

    const assets = await api.fetchAssetsMarketData({
      category: id || '',
      perPage: state.assets.perPage,
      pageIndex: state.assets.pageIndex,
      currency: state.assets.currency,
    })

    if (
      id === state.categories.presets.all.id &&
      state.assets.pageIndex === 1
    ) {
      updateCategoryAll(assets)
    }

    setState('assets', {
      areAllFetched: assets.length < state.assets.perPage,
      list: [...currentAssets, ...assets],
    })
  }

  createEffect(() => {
    const id = searchParams.category || ''

    const category = state.categories.list.find(
      (category) => category?.id === id
    )

    if (category) {
      setState('assets', {
        pageIndex: 1,
        areAllFetched: false,
      })

      setState('categories', { selected: category })
    }
  })

  createEffect(() => {
    if (state.mounted && state.categories.selected?.id !== undefined) {
      untrack(() => {
        fetchAssets()
      })
    }
  })

  onMount(async () => {
    setState('categories', 'list', [
      state.categories.presets.all,
      ...(await api.fetchCategoriesMarketData()),
    ])

    let observeProcessing = false
    let waitingEntries = null

    const observerCallback: IntersectionObserverCallback = async (entries) => {
      if (!state.assets.areAllFetched && entries[0].isIntersecting) {
        if (observeProcessing) {
          waitingEntries = entries
        } else {
          observeProcessing = true
          waitingEntries = null

          setState('assets', 'pageIndex', (i) => i + 1)

          await fetchAssets()

          observeProcessing = false

          if (observer && waitingEntries) {
            observerCallback(waitingEntries, observer)
          }
        }
      }
    }

    observer = new IntersectionObserver(observerCallback, {
      rootMargin: '50%',
    })

    if (observedElement) {
      observer.observe(observedElement)
    }

    setState('mounted', true)
  })

  onCleanup(() => {
    observer?.disconnect()
  })

  return (
    <MaxWidth2Screen class="py-8">
      <div class="flex justify-center">
        <div class="inline-flex space-x-2 rounded-full border-4 border-black p-1">
          <Select
            pre="View"
            leftSvg={IconTablerLayoutList}
            values={['Assets', 'Strategies']}
            selected={'Assets'}
            roundedFull
            full={false}
            primary
          />
          <DialogSearch
            button={{
              text: 'Search',
              leftSvg: IconTablerSearch,
              roundedFull: true,
              primary: true,
            }}
            title=""
            pre=""
            placeholder="Search for an asset here"
            value=""
            onInput={() => {}}
            onClose={() => {}}
          >
            <For each={[]}>{(el) => <div></div>}</For>
          </DialogSearch>
        </div>
      </div>
      <TabsCategories
        categories={state.categories.list}
        selectedCategory={state.categories.selected}
        selectCategory={(id: string) => {
          setSearchParams({
            category: id,
          })
        }}
      />
      <div>
        Crypto assets sorted by Market Cap. -{' '}
        {state.categories.selected?.market_cap.toLocaleString('en')}
      </div>
      <div class="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <For each={state.assets.list}>
          {(asset) => <AssetCard asset={asset} />}
        </For>
      </div>
      <div ref={observedElement} />
    </MaxWidth2Screen>
  )
}
