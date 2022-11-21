interface ObjectByAssetSource<T> {
  coinGecko: T
  yahoo: T
}

type AssetSource = keyof ObjectByAssetSource<any>

interface ObjectByAssetKind<T> {
  crypto: T
  equity: T
  etf: T
}

type AssetKind = keyof ObjectByAssetKind<any>

interface FetchedAsset {
  source: AssetSource
  kind: AssetKind
  id?: string
  symbol: string
  name: string
  rank?: number
  src?: string
  rgb?: RGB
}

interface Asset extends FetchedAsset {
  rgb: RGB
  url: string
  icon: Icon
  chart: AssetChartData[]
  repartition: number
  platform?: Platform
}

interface AssetChartData {
  date: Date
  price: number
  volume: number
}

interface Category {
  kind: AssetKind
  name: string
  assets: Asset[]
  repartition: number
}

interface Platform {
  name: string
  fees: Fees
  hasSplittableAssets: boolean
}

interface Fees {
  flat: number
  percentage: number
}

interface Investment {
  currency: Currency
  initial: number
  recurrent: number
  isDateAnInvestmentDay: IsDateAnInvestmentDay
}

interface Interval {
  start: Date
  end: Date
}
