import { createSelectableList, getOrdinalDay } from '/src/scripts'

import Section from '/src/components/section'
import Select from '/src/components/select'

export default () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const maxDays = 28

  const timeframes = [
    {
      name: 'Daily',
    },
    {
      name: 'Weekly',
      options: createSelectableList(
        [...Array(7).keys()].map((key) =>
          new Date(0, 0, key + 1).toLocaleString('en', { weekday: 'long' })
        )
      ),
    },
    {
      name: 'Biweekly',
      options: createSelectableList(
        [...Array(Math.round(maxDays / 2)).keys()].map(
          (day) =>
            `The ${getOrdinalDay(day + 1)} and the ${getOrdinalDay(day + 15)}`
        )
      ),
    },
    {
      name: 'Monthly',
      options: createSelectableList(
        [...Array(maxDays).keys()].map((day) => `The ${getOrdinalDay(day + 1)}`)
      ),
    },
  ]

  const [state, setState] = createStore({
    timeframes: createSelectableList(timeframes, {
      selected:
        timeframes.find(
          (timeframe) => timeframe.name.toLowerCase() === searchParams.timeframe
        ) ?? 1,
    }),
  })

  return (
    <Section title="Frequency" description={`Select a timeframe here`}>
      <Select
        pre="Frequency"
        leftSvg={IconTablerCalendar}
        selected={state.timeframes.selected?.name}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value

          setState('timeframes', {
            selected:
              state.timeframes.list.find(
                (timeframe) => timeframe.name === value
              ) ?? null,
          })

          // setSearchParams({
          //   ...searchParams,
          //   timeframe: value.toLowerCase(),
          // })
        }}
        values={state.timeframes.list.map((timeframe) => timeframe.name)}
      />
      <Show when={state.timeframes.selected?.options}>
        <Select
          pre="Day"
          leftSvg={IconTablerAlarm}
          selected={String(state.timeframes.selected?.options?.selected) || ''}
          onChange={(event) => {
            const value = (event.target as HTMLInputElement).value

            setState('timeframes', 'selected', 'options', 'selected', value)

            setSearchParams({
              day: value.toLowerCase(),
            })
          }}
          values={
            state.timeframes.selected?.options?.list.map((value) =>
              String(value)
            ) || []
          }
        />
      </Show>
    </Section>
  )
}
