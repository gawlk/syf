import { createBaseAPI } from '../base'

export const createYahooAPI = () => {
  return {
    ...createBaseAPI({
      baseUrl: 'http://localhost:8000',
    }),
    convertAssetToUrl: (asset: FetchedAsset) =>
      `https://finance.yahoo.com/quote/${asset.symbol}/`,
    search: async function (query: string, signal?: AbortSignal) {
      const result = await this.fetchJSON<{
        quotes: Partial<YahooSearchData>[]
      }>(`/search?q=${query}`, signal)

      return result.quotes
        .filter(
          (quote) =>
            quote.symbol &&
            (quote.quoteType === 'EQUITY' ||
              quote.quoteType === 'ETF' ||
              quote.quoteType === 'CRYPTOCURRENCY')
        )
        .map((quote): FetchedAsset => {
          return {
            source: 'yahoo',
            kind:
              quote.quoteType === 'EQUITY'
                ? 'equity'
                : quote.quoteType === 'ETF'
                ? 'etf'
                : 'crypto',
            symbol: String(quote.symbol),
            name: quote.shortname || quote.longname || '',
          }
        })
    },
    quote: function (symbol: string) {
      return this.fetchJSON<CoinGeckoSearchData>(`/quote?symbols=${symbol}`)
    },
    download: async function (symbol: string) {
      const csv = await this.fetchText(`/download?symbol=${symbol}`)

      const lines = csv.split('\n')

      const attributes = lines
        .splice(0, 1)[0]
        .split(',')
        .map((attribute) => attribute.toLowerCase())

      return lines
        .map((line) => {
          const obj: any = {}

          line
            .split(',')
            .map(
              (value, index) =>
                (obj[attributes[index]] = isNaN(value as any)
                  ? /^(19|20)[0-9]{2}-(0|1)[0-9]-(0|1|2|3)[0-9]$/.test(value)
                    ? new Date(value)
                    : value
                  : Number(value))
            )

          return obj as YahooAssetMarketChart
        })
        .sort((a, b) => a.date.valueOf() - b.date.valueOf())
    },
  }
}
