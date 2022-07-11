export default () => {
  return (
    <For
      each={[
        {
          name: 'Minimal',
          radioColor: 'focus-within:ring-lime-300 checked:bg-lime-400',
          labelColor: 'text-lime-600',
          barColor: 'from-lime-400',
        },
        {
          name: 'Low',
          radioColor: 'focus-within:ring-yellow-300 checked:bg-yellow-400',
          labelColor: 'text-yellow-600',
          barColor: 'from-yellow-400',
        },
        {
          name: 'Moderate',
          radioColor: 'focus-within:ring-amber-300 checked:bg-amber-400',
          labelColor: 'text-amber-600',
          barColor: 'from-amber-400',
        },
        {
          name: 'High',
          radioColor: 'focus-within:ring-orange-300 checked:bg-orange-400',
          labelColor: 'text-orange-600',
          barColor: 'from-orange-400',
        },
        {
          name: 'Extreme',
          radioColor: 'focus-within:ring-red-300 checked:bg-red-400',
          labelColor: 'text-red-600',
          barColor: 'from-red-400',
        },
      ]}
    >
      {(object, index) => (
        <div class="flex w-full flex-1 items-center space-x-4 sm:flex-col sm:space-x-0 sm:space-y-2">
          <div class="relative flex w-5 items-center justify-center self-stretch sm:h-5 sm:w-full">
            <Show when={index() > 0}>
              <div class="absolute inset-x-0 top-0 flex h-[50%] w-full items-center  justify-center sm:inset-x-1/2 sm:inset-y-0 sm:left-0 sm:h-full sm:w-1/2">
                <div
                  class={`h-full w-2 bg-gradient-to-t to-stone-100 transition-colors duration-200 sm:h-2 sm:w-full sm:bg-gradient-to-l ${
                    index() === 0 ? object.barColor : 'from-stone-100'
                  }`}
                />
              </div>
            </Show>
            <input
              type="radio"
              onChange={(event) => {
                const value = (event.target as HTMLInputElement).value

                // state.risk = Number(value)
              }}
              id={`risk-choice-${index()}`}
              name="risk"
              value={index()}
              checked={index() === 0}
              class={[
                index() === 0 ? 'ring-offset-[3px]' : '',
                object.radioColor,
                'z-20 h-5 w-5 cursor-pointer appearance-none rounded-full border-stone-300 bg-stone-100 text-center ring-[3px] ring-transparent transition duration-200 focus-within:outline-none focus-within:ring-opacity-80',
              ].join(' ')}
            />
            <Show when={index() < 4}>
              <div class="absolute inset-x-0 bottom-0  flex h-[50%] w-full items-center justify-center sm:inset-x-1/2 sm:inset-y-0 sm:right-0 sm:h-full sm:w-1/2">
                <div
                  class={`h-full w-2 bg-gradient-to-b to-stone-100 transition-colors duration-200 sm:h-2 sm:w-full sm:bg-gradient-to-r ${
                    index() === 0 ? object.barColor : 'from-stone-100'
                  }`}
                />
              </div>
            </Show>
          </div>
          <label
            for={`risk-choice-${index()}`}
            class={`text-center font-semibold transition-colors duration-200 ${
              0 === index() ? object.labelColor : 'text-stone-400'
            }`}
          >
            {object.name}
          </label>
        </div>
      )}
    </For>
  )
}
