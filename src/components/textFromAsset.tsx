import { convertRGBToOffTextCSSRGB } from '/src/scripts'

interface Props {
  asset: Asset
  showKind?: boolean
}

export default (props: Props) => {
  const style = {
    color: props.asset.rgb
      ? convertRGBToOffTextCSSRGB(props.asset.rgb)
      : undefined,
  }

  return (
    <span class="flex-1 truncate text-left">
      <span class="font-semibold">{props.asset.symbol.toUpperCase()}</span>
      <span class="text-stone-500" style={style}>
        {' - '}
        {props.asset.name}
      </span>
      <Show when={props.showKind || props.asset.rank}>
        <span class="text-sm font-medium text-stone-500" style={style}>
          {' '}
          <Show when={props.showKind}>
            <span class="font-semibold uppercase">{props.asset.kind}</span>
            {props.asset.rank ? ' ' : ''}
          </Show>
          <Show when={props.asset.rank}>
            <span style="font-size: 0.9em">#</span>
            {props.asset.rank}
          </Show>
        </span>
      </Show>
    </span>
  )
}
