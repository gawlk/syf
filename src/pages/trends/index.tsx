import {
  createCoinGeckoAPI,
  convertStringToBackgroundColorProperty,
} from '/src/scripts'

import TextFromAsset from '../../components/textFromAsset'
import Button from '/src/components/button'
import ButtonDivider from '/src/components/buttonDivider'
import DialogSearch from '/src/components/dialogSearch'
import Link from '/src/components/link'
import MaxWidth2Screen from '/src/components/maxWidth2Screen'
import TitlePage from '/src/components/titlePage'

export default () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const api = createCoinGeckoAPI()

  const [state, setState] = createStore({
    asset: null as {
      coinData: CoinGeckoSearchCoinData
      marketChart?: CoinGeckoAssetMarketChart
    } | null,
    search: {
      name: '',
      defaultResults: null as CoinGeckoSearchData | null,
      results: null as CoinGeckoSearchData | null,
    },
  })

  const searchAssets = async (value: string) => {
    setState('search', {
      results: value
        ? await api.searchData(value)
        : state.search.defaultResults,
    })
  }

  onMount(async () => {
    // setState(
    //   'assets',
    //   await Promise.all(
    //     (searchParams.assets || '')
    //       .split(',')
    //       .filter((id) => id)
    //       .map(async (id) => {
    //         return {
    //           data: await api.fetchAssetData({
    //             id,
    //           }),
    //           marketChart: await api.fetchAssetMarketChart({
    //             id,
    //           }),
    //         }
    //       })
    //   )
    // )

    const defaultResults = await api.searchData('')

    console.log(defaultResults)

    setState('asset', {
      coinData: defaultResults.coins[0],
    })

    setState('search', {
      defaultResults,
      results: defaultResults,
    })
  })

  return (
    <MaxWidth2Screen class="py-8">
      <TitlePage />
      <DialogSearch
        title="Select an asset"
        button={{
          text: 'Add an asset',
          full: false,
          rightIcon: IconTablerSelector,
          rightIconClass: '',
        }}
        pre="Name"
        placeholder="Asset"
        value={state.search.name}
        onInput={(value: string) => {
          searchAssets(value)
        }}
        onClose={() => {}}
      >
        <For each={(state.search.results?.coins || []).splice(0, 500)}>
          {(result) => {
            const backgroundColor = convertStringToBackgroundColorProperty(
              result.id
            )

            return (
              <div class="flex">
                <Button
                  value={result.id}
                  leftIcon={result.large}
                  rightIcon={
                    state.asset?.coinData.id === result.id && IconTablerCheck
                  }
                  full
                  transparent
                  class="rounded-r-none hover:brightness-90"
                  style={backgroundColor}
                >
                  <TextFromAsset asset={result} />
                </Button>
                <ButtonDivider backgroundColor={backgroundColor} />
                <Link
                  href={`https://www.coingecko.com/en/coins/${result.id}`}
                  transparent
                  class="rounded-l-none hover:brightness-90"
                  style={backgroundColor}
                />
              </div>
            )
          }}
        </For>
      </DialogSearch>
    </MaxWidth2Screen>
  )
}
