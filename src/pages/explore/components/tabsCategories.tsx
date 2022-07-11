import { Transition } from 'solid-transition-group'

import TabCategory from './tabCategory'

interface Props {
  categories: SolidJS.DeepReadonly<(CoinGeckoCategoryMarketData | null)[]>
  selectedCategory: SolidJS.DeepReadonly<CoinGeckoCategoryMarketData | null>
  selectCategory: (id: string) => void
}

export default (props: Props) => {
  const [state, setState] = createStore({
    hasIntersected: false,
    showLeftArrow: false,
    showRightArrow: true,
  })

  let scrollableDiv: HTMLDivElement | undefined
  let observedElement: HTMLButtonElement | undefined
  let observer: IntersectionObserver | undefined

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setState('hasIntersected', true)
        }
      },
      {
        rootMargin: '16px',
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
    <div class="relative -mx-6 border-b md:border-0">
      <For
        each={[
          {
            showArrowKey: 'showLeftArrow',
            side: 'left-0',
            order: '',
            buttonPadding: 'pl-6 pr-2',
            scrollMultiplier: -1,
            chevronIcon: IconHeroiconsSolidChevronLeft,
            gradientDirection: 'bg-gradient-to-r',
            roundness: 'rounded-l-xl',
          },
          {
            showArrowKey: 'showRightArrow',
            side: 'right-0',
            order: 'order-2',
            buttonPadding: 'pl-2 pr-6',
            scrollMultiplier: 1,
            chevronIcon: IconHeroiconsSolidChevronRight,
            gradientDirection: 'bg-gradient-to-l',
            roundness: 'rounded-r-xl',
          },
        ]}
      >
        {(obj) => (
          <Transition
            enterClass="opacity-0"
            enterToClass="opacity-100"
            exitToClass="opacity-0"
          >
            {(state as any)[obj.showArrowKey] && (
              <div
                class={[
                  obj.side,
                  'absolute top-0 bottom-0 z-20 flex transition-opacity duration-200 ease-in-out',
                ].join(' ')}
              >
                <div
                  class={[
                    obj.order,
                    obj.buttonPadding,
                    obj.roundness,
                    'hidden h-full items-center bg-white md:flex',
                  ].join(' ')}
                >
                  <button
                    onClick={() => {
                      scrollableDiv?.scrollBy({
                        left: Math.floor(
                          scrollableDiv?.clientWidth *
                            obj.scrollMultiplier *
                            0.8
                        ),
                        behavior: 'smooth',
                      })
                    }}
                    class="clickable rounded-full border-2 border-black bg-white p-0.5 hover:scale-110 active:scale-100"
                  >
                    <Dynamic component={obj.chevronIcon} class="h-5 w-5" />
                  </button>
                </div>
                <div
                  class={[
                    obj.gradientDirection,
                    'h-full w-8 from-white to-transparent',
                  ].join(' ')}
                />
              </div>
            )}
          </Transition>
        )}
      </For>
      <div
        ref={scrollableDiv}
        onScroll={(event) => {
          const offset = 20

          const left = event.target.scrollLeft
          const right =
            event.target.scrollWidth -
            event.target.scrollLeft -
            event.target.clientWidth

          setState('showLeftArrow', left > offset)
          setState('showRightArrow', right > offset)
        }}
        class="flex space-x-6 overflow-x-auto rounded-xl px-6 md:py-2"
      >
        <For each={props.categories}>
          {(category) => (
            <TabCategory
              category={category}
              isSelected={category?.id === props.selectedCategory?.id}
              selectCategory={props.selectCategory}
            />
          )}
        </For>
      </div>
    </div>
  )
}
