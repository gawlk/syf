import { createBaseAPI } from '../base'

export const createCoinGeckoAPI = () => {
  return {
    ...createBaseAPI({
      baseUrl: 'https://api.coingecko.com/api/v3',
      rate: {
        max: 50,
        timeout: 60000,
      },
    }),
    convertAssetToUrl: (asset: FetchedAsset) =>
      `https://www.coingecko.com/en/coins/${asset.id}`,
    fetchAssetData: function (parameters: {
      id: string
      localization?: boolean
      tickers?: boolean
      market_data?: boolean
      community_data?: boolean
      developer_data?: boolean
      sparkline?: boolean
    }) {
      return this.fetchJSON<CoinGeckoAssetData>(
        `/coins/${parameters.id}?localization=${
          parameters.localization || false
        }&tickers=${parameters.tickers || false}&market_data=${
          parameters.market_data || false
        }&community_data=${parameters.community_data || false}&developer_data=${
          parameters.developer_data || false
        }&sparkline=${parameters.sparkline || false}`
      )
    },
    fetchAssetMarketChart: function (parameters: {
      id: string
      currency?: string
      days?: number | string
      interval?: 'daily' | ''
    }) {
      return this.fetchJSON<CoinGeckoAssetMarketChart>(
        `/coins/${parameters.id}/market_chart?vs_currency=${
          parameters.currency || 'usd'
        }&days=${parameters.days || 'max'}&interval=${
          parameters.interval || ''
        }`
      )
    },
    fetchAssetsMarketData: function (parameters: {
      category: string
      perPage: number
      pageIndex: number
      currency: string
    }) {
      return this.fetchJSON<CoinGeckoAssetMarketData[]>(
        `/coins/markets?vs_currency=${parameters.currency || 'usd'}${
          parameters.category ? `&category=${parameters.category}` : ''
        }&per_page=${parameters.perPage || 20}&page=${
          parameters.pageIndex || 1
        }&sparkline=true&price_change_percentage=7d`
      )
    },
    fetchCategoriesMarketData: function () {
      return this.fetchJSON<CoinGeckoCategoryMarketData[]>('/coins/categories')
    },
    fetchGlobalData: function () {
      return this.fetchJSON<CoinGeckoGlobalData>('/global')
    },
    fetchAssetsList: function () {
      return this.fetchJSON<CoinGeckoListedAsset[]>('/coins/list')
    },
    searchData: async function (
      query: string,
      signal?: AbortSignal
    ): Promise<FetchedAsset[]> {
      const results = await this.fetchJSON<CoinGeckoSearchData>(
        `/search?query=${query}`,
        signal
      )

      return results.coins.map((coin): FetchedAsset => {
        return {
          source: 'coinGecko',
          kind: 'crypto',
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          rank: coin.market_cap_rank,
          src: coin.large,
        }
      })
    },
    supportedFiatCurrencies: [],
  }
}
