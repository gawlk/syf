interface Props {
  currency: Currency
}

export default (props: Props) => {
  return (
    <span class="flex-1 truncate text-left">
      <span class="font-semibold">{props.currency.symbol.toUpperCase()}</span>
      <span class="text-stone-500">
        {' - '}
        {props.currency.name}
      </span>
    </span>
  )
}
