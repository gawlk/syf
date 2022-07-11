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
    fetchAssetData: async function (parameters: {
      id: string
      localization?: boolean
      tickers?: boolean
      market_data?: boolean
      community_data?: boolean
      developer_data?: boolean
      sparkline?: boolean
    }) {
      return this.fetch<CoinGeckoAssetData>(
        `/coins/${parameters.id}?localization=${
          parameters.localization || false
        }&tickers=${parameters.tickers || false}&market_data=${
          parameters.market_data || false
        }&community_data=${parameters.community_data || false}&developer_data=${
          parameters.developer_data || false
        }&sparkline=${parameters.sparkline || false}`
      )
    },
    fetchAssetMarketChart: async function (parameters: {
      id: string
      currency?: string
      days?: number | string
      interval?: 'daily' | ''
    }) {
      return this.fetch<CoinGeckoAssetMarketChart>(
        `/coins/${parameters.id}/market_chart?vs_currency=${
          parameters.currency || 'usd'
        }&days=${parameters.days || 'max'}&interval=${
          parameters.interval || ''
        }`
      )
    },
    fetchAssetsMarketData: async function (parameters: {
      category: string
      perPage: number
      pageIndex: number
      currency: string
    }) {
      return this.fetch<CoinGeckoAssetMarketData[]>(
        `/coins/markets?vs_currency=${parameters.currency || 'usd'}${
          parameters.category ? `&category=${parameters.category}` : ''
        }&per_page=${parameters.perPage || 20}&page=${
          parameters.pageIndex || 1
        }&sparkline=true&price_change_percentage=7d`
      )
    },
    fetchCategoriesMarketData: async function () {
      return this.fetch<CoinGeckoCategoryMarketData[]>('/coins/categories')
    },
    fetchGlobalData: async function () {
      return this.fetch<CoinGeckoGlobalData>('/global')
    },
    fetchAssetsList: async function () {
      return this.fetch<CoinGeckoListedAsset[]>('/coins/list')
    },
    searchData: async function (query: string) {
      return this.fetch<CoinGeckoSearchData>(`/search?query=${query}`)
    },
    supportedFiatCurrencies: [
      {
        symbol: 'AED',
        name: 'United Arab Emirates Dirham',
      },
      {
        symbol: 'ARS',
        name: 'Argentine Peso',
      },
      {
        symbol: 'AUD',
        name: 'Australian Dollar',
      },
      {
        symbol: 'BDT',
        name: 'Bangladeshi Taka',
      },
      {
        symbol: 'BHD',
        name: 'Bahraini Dinar',
      },
      {
        symbol: 'BMD',
        name: 'Bermudian Dollar',
      },
      {
        symbol: 'BRL',
        name: 'Brazil Real',
      },
      {
        symbol: 'CAD',
        name: 'Canadian Dollar',
      },
      {
        symbol: 'CHF',
        name: 'Swiss Franc',
      },
      {
        symbol: 'CLP',
        name: 'Chilean Peso',
      },
      {
        symbol: 'CNY',
        name: 'Chinese Yuan',
      },
      {
        symbol: 'CZK',
        name: 'Czech Koruna',
      },
      {
        symbol: 'DKK',
        name: 'Danish Krone',
      },
      {
        symbol: 'EUR',
        name: 'Euro',
      },
      {
        symbol: 'GBP',
        name: 'British Pound Sterling',
      },
      {
        symbol: 'HKD',
        name: 'Hong Kong Dollar',
      },
      {
        symbol: 'HUF',
        name: 'Hungarian Forint',
      },
      {
        symbol: 'IDR',
        name: 'Indonesian Rupiah',
      },
      {
        symbol: 'ILS',
        name: 'Israeli New Shekel',
      },
      {
        symbol: 'INR',
        name: 'Indian Rupee',
      },
      {
        symbol: 'JPY',
        name: 'Japanese Yen',
      },
      {
        symbol: 'KRW',
        name: 'South Korean Won',
      },
      {
        symbol: 'KWD',
        name: 'Kuwaiti Dinar',
      },
      {
        symbol: 'LKR',
        name: 'Sri Lankan Rupee',
      },
      {
        symbol: 'MMK',
        name: 'Burmese Kyat',
      },
      {
        symbol: 'MXN',
        name: 'Mexican Peso',
      },
      {
        symbol: 'MYR',
        name: 'Malaysian Ringgit',
      },
      {
        symbol: 'NGN',
        name: 'Nigerian Naira',
      },
      {
        symbol: 'NOK',
        name: 'Norwegian Krone',
      },
      {
        symbol: 'NZD',
        name: 'New Zealand Dollar',
      },
      {
        symbol: 'PHP',
        name: 'Philippine Peso',
      },
      {
        symbol: 'PKR',
        name: 'Pakistani Rupee',
      },
      {
        symbol: 'PLN',
        name: 'Polish Zloty',
      },
      {
        symbol: 'RUB',
        name: 'Russian Ruble',
      },
      {
        symbol: 'SAR',
        name: 'Saudi Riyal',
      },
      {
        symbol: 'SEK',
        name: 'Swedish Krona',
      },
      {
        symbol: 'SGD',
        name: 'Singapore Dollar',
      },
      {
        symbol: 'THB',
        name: 'Thai Baht',
      },
      {
        symbol: 'TRY',
        name: 'Turkish Lira',
      },
      {
        symbol: 'TWD',
        name: 'New Taiwan Dollar',
      },
      {
        symbol: 'UAH',
        name: 'Ukrainian hryvnia',
      },
      {
        symbol: 'USD',
        name: 'US Dollar',
      },
      {
        symbol: 'VEF',
        name: 'Venezuelan bolívar fuerte',
      },
      {
        symbol: 'VND',
        name: 'Vietnamese đồng',
      },
      {
        symbol: 'ZAR',
        name: 'South African Rand',
      },
      {
        symbol: 'XDR',
        name: 'IMF Special Drawing Rights',
      },
    ],
  }
}
