interface YahooSearchData {
  symbol: string
  quoteType:
    | 'ETF'
    | 'EQUITY'
    | 'MUTUALFUND'
    | 'FUTURE'
    | 'OPTION'
    | 'CRYPTOCURRENCY'
  name: string
  shortname?: string
  longname?: string
}

interface YahooAssetMarketChart {
  date: Date
  open: number
  close: number
  high: number
  low: number
  'adj close': number
  volume: number
}
