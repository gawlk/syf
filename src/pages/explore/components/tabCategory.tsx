interface Props {
  category: SolidJS.DeepReadonly<CoinGeckoCategoryMarketData | null>
  isSelected: boolean
  selectCategory: (id: string) => void
}

export default (props: Props) => {
  const [state, setState] = createStore({
    hasIntersected: false,
  })

  let observedElement: HTMLButtonElement | undefined
  let observer: IntersectionObserver | undefined

  const formatCategoryName = (name: string) =>
    name.includes('(')
      ? name.match(/\((.*)\)/)?.pop() || ''
      : name
          .split(' ')
          .filter(
            (word) =>
              word !== 'Chain' &&
              word !== 'Coins' &&
              word !== 'Ecosystem' &&
              word !== 'Tokens' &&
              word !== 'Platform'
          )
          .map((word) => word.replace('/', ' / '))
          .join(' ')

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setState('hasIntersected', true)
          observer?.disconnect()
        }
      },
      {
        rootMargin: '10%',
      }
    )

    if (observedElement) {
      observer.observe(observedElement)
    }
  })

  onCleanup(() => {
    observer?.disconnect()
  })

  return (
    <button
      ref={observedElement}
      onClick={() => props.category && props.selectCategory(props.category.id)}
      class={[
        !props.category ? 'animate-pulse' : '',
        props.isSelected
          ? 'opacity-100 grayscale-0'
          : 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0',
        'clickable group space-y-2 whitespace-nowrap rounded-xl px-1 pt-3 text-center active:scale-95',
      ].join(' ')}
    >
      <div class="flex justify-center -space-x-2">
        <For each={props.category?.top_3_coins || ['', '', '']}>
          {(src, index) => (
            <div
              style={`z-index: ${3 - index()}`}
              class="z-0 h-7 w-7 rounded-full border-2 border-black bg-white p-0.5"
            >
              <Show when={state.hasIntersected && src}>
                <img
                  src={src}
                  class="h-full w-full rounded-full bg-white object-contain"
                />
              </Show>
            </div>
          )}
        </For>
      </div>
      <p
        class={[
          props.category?.name ? 'opacity-100' : 'opacity-0',
          props.isSelected
            ? 'border-black'
            : 'border-transparent group-hover:border-stone-300',
          'inline-block border-b-2 pb-3 text-sm transition-opacity duration-200',
        ].join(' ')}
      >
        {formatCategoryName(props.category?.name || '.')}
      </p>
    </button>
  )
}
