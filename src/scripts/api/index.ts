import {
  createManagedAbortController,
  iconsLettersAndNumbers,
  stringToRGB,
} from '/src/scripts'

import { createCoinGeckoAPI } from './coinGecko'
import { createGithubAPI } from './github'
import { createYahooAPI } from './yahoo'

export const createAPI = () => {
  const apis = {
    coinGecko: createCoinGeckoAPI(),
    github: createGithubAPI(),
    yahoo: createYahooAPI(),
  }

  const rbgs: ObjectByAssetKind<RGBs | undefined> = {
    crypto: undefined,
    equity: undefined,
    etf: undefined,
  }

  const fetchingCryptoRGBs = (async () => {
    rbgs.crypto = await apis.github.fetchCryptoRGBs()
  })()

  const fixFetchedAsset = (
    asset: FetchedAsset,
    convertAssetToUrl: (asset: FetchedAsset) => string,
    rgbs?: RGBs
  ): Asset => {
    return {
      ...asset,
      url: convertAssetToUrl(asset),
      icon:
        asset.src ||
        (iconsLettersAndNumbers as any)[
          asset.symbol.at(0)?.toLowerCase() || ''
        ],
      rgb:
        asset.rgb ||
        (rgbs && (asset.id ? rgbs[asset.id] : rgbs[asset.symbol])) ||
        stringToRGB(asset.symbol),
      chart: [],
      repartition: 0,
    }
  }

  const fixCoinGeckoFetchedAsset = (asset: FetchedAsset) =>
    fixFetchedAsset(asset, apis.coinGecko.convertAssetToUrl, rbgs.crypto)

  const fixYahooFetchedAsset = (asset: FetchedAsset) =>
    fixFetchedAsset(asset, apis.yahoo.convertAssetToUrl)

  return {
    fetchSearchDefaults: async (): Promise<ObjectByAssetKind<Asset[]>> => {
      const defaults = await Promise.all([
        apis.coinGecko.searchData(''),
        apis.github.fetchDefaultEquities(),
        apis.github.fetchDefaultETFs(),
        fetchingCryptoRGBs,
      ])

      return {
        crypto: defaults[0].map((asset) => fixCoinGeckoFetchedAsset(asset)),
        equity: defaults[1].map((asset) => fixYahooFetchedAsset(asset)),
        etf: defaults[2].map((asset) => fixYahooFetchedAsset(asset)),
      }
    },
    searchAssets: async (
      query: string,
      options?: ObjectByAssetSource<boolean>
    ): Promise<Asset[]> => {
      console.log(query, options)

      const { signal } = createManagedAbortController('searchAssets')

      const results = await Promise.all([
        !options || options.coinGecko
          ? apis.coinGecko.searchData(query, signal)
          : undefined,
        !options || options.yahoo
          ? apis.yahoo.search(query, signal)
          : undefined,
        fetchingCryptoRGBs,
      ])

      const coinGeckoAssets =
        (results[0] || []).map((asset) => fixCoinGeckoFetchedAsset(asset)) || []

      const yahooAssets = (results[1] || []).map((asset) =>
        fixYahooFetchedAsset(asset)
      )

      return [
        ...(yahooAssets
          .map((asset) => {
            let cryptoAsset

            if (asset.kind === 'crypto') {
              const index = coinGeckoAssets.findIndex(
                (crypto) =>
                  crypto.symbol.toLowerCase() ===
                  asset.symbol.split('-')[0].toLowerCase()
              )

              index !== -1 &&
                (cryptoAsset = coinGeckoAssets.splice(index, 1)[0])
            }

            return asset.kind === 'equity' || asset.kind === 'etf'
              ? fixYahooFetchedAsset({
                  source: 'yahoo',
                  kind: asset.kind,
                  name: asset.name,
                  symbol: asset.symbol,
                })
              : cryptoAsset
          })
          .filter((asset) => asset) as Asset[]),
        ...coinGeckoAssets,
      ]
    },
    fetchAssetMarketChart: async (asset: Asset) => {
      let chart: AssetChartData[] | undefined
      let start: number | undefined
      let end: number | undefined

      if (asset.kind === 'crypto') {
        start = performance.now()
        const dataset = await apis.coinGecko.fetchAssetMarketChart({
          id: asset.id as string,
        })
        end = performance.now()
        console.log(`Fetching ${asset.symbol} dataset took ${end - start}ms`)

        start = performance.now()
        chart = dataset.prices.map(
          (
            [timestamp, price]: [number, number],
            index: number
          ): AssetChartData => {
            return {
              date: new Date(timestamp),
              price,
              volume: dataset.total_volumes[index][1] / price,
            }
          }
        )
        end = performance.now()
        console.log(`Cleaning ${asset.symbol} dataset took ${end - start}ms`)
      } else {
        start = performance.now()
        const dataset = await apis.yahoo.download(asset.symbol)
        end = performance.now()
        console.log(`Fetching ${asset.symbol} dataset took ${end - start}ms`)

        start = performance.now()
        chart = dataset.map((data): AssetChartData => {
          return {
            date: data.date,
            price: data['adj close'],
            volume: data.volume,
          }
        })
      }
      end = performance.now()
      console.log(`Cleaning ${asset.symbol} dataset took ${end - start}ms`)

      return chart
    },
  }
}
