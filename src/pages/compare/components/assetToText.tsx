interface Props {
  data: CoinGeckoSearchCoinData | CoinGeckoAssetData
}

export default (props: Props) => {
  return (
    <span class="flex-1 truncate text-left">
      <span class="font-semibold">{props.data.symbol.toUpperCase()}</span>
      {' - '}
      <span class="opacity-75">{props.data.name}</span>{' '}
      <span class="text-sm font-medium opacity-50">
        <span style="font-size: 0.9em">#</span>
        {props.data.market_cap_rank || '?'}
      </span>
    </span>
  )
}
