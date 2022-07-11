import Input from '/src/components/input'
import Section from '/src/components/section'

export default () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const today = new Date()

  const defaultDate = new Date(today)
  defaultDate.setDate(defaultDate.getDate() - 365)

  const [state, setState] = createStore({
    start: defaultDate,
    end: today,
  })

  const toISO = (date: Date) => date.toISOString().split('T')[0]

  return (
    <Section title="Interval" description={`Select intervals here`}>
      <For
        each={[
          {
            pre: 'Start',
            icon: IconTablerArrowBarRight,
            valueKey: 'start',
            default: defaultDate,
          },
          {
            pre: 'End',
            icon: IconTablerArrowBarToRight,
            valueKey: 'end',
            default: today,
          },
        ]}
      >
        {(obj) => {
          return (
            <Input
              id={`${obj.pre.toLowerCase()}-date`}
              pre={obj.pre}
              leftSvg={obj.icon}
              type="date"
              value={toISO((state as any)[obj.valueKey])}
              max={toISO(today)}
              onInput={(event) => {
                const input = event.target as HTMLInputElement
                const value = input.value

                if (!value) {
                  if ((state as any)[obj.valueKey] === obj.default) {
                    input.value = toISO(defaultDate)
                  } else {
                    setState(obj.valueKey as any, obj.default)
                  }
                }
              }}
              onFocusOut={(event) => {
                const input = event.target as HTMLInputElement
                const value = input.value

                if (value) {
                  const date = new Date(value)
                  setState(obj.valueKey as any, date)
                }
              }}
            />
          )
        }}
      </For>
    </Section>
  )
}
