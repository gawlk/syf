import RebuildTheEconomyURL from '/src/assets/drawkit/rebuild-the-economy.svg?url'

import Slide from '/src/components/slide'
import Bar from '/src/components/bar'

export default () => {
  let arrow: HTMLDivElement | ((el: HTMLDivElement) => void) | undefined

  const [showArrow, setShowArrow] = createSignal(true)

  const updateArrowVisibility = () => {
    setShowArrow(
      window.innerHeight -
        (arrow as HTMLDivElement).getBoundingClientRect().bottom <
        window.innerHeight / 20
    )
  }

  onMount(() => {
    updateArrowVisibility()
    window.addEventListener('scroll', updateArrowVisibility)
  })

  onCleanup(() => {
    window.removeEventListener('scroll', updateArrowVisibility)
  })

  return (
    <div class="relative h-screen overflow-hidden">
      <Slide
        url={RebuildTheEconomyURL}
        lines={['INVEST.', 'HOLD.', 'REPEAT.']}
      />

      <div class="absolute inset-0 flex h-full w-full flex-col items-center justify-between">
        <Bar />

        <div
          ref={arrow}
          class={`${
            showArrow() ? 'opacity-100' : 'opacity-0'
          }  animate-bounce p-6  text-stone-300 transition duration-500`}
        >
          <IconTablerArrowDown class="h-12 w-12" />
        </div>
      </div>
    </div>
  )
}
