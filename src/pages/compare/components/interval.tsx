import DialogDate from '/src/components/dialogDate'
import Section, { type Props as SectionProps } from '/src/components/section'

interface Props {
  setter: (start: Date, end: Date) => void
}

export const defaultEnd = new Date()
defaultEnd.setUTCHours(0, 0, 0, 0)

export const defaultStart = new Date(defaultEnd)
defaultStart.setUTCFullYear(defaultStart.getUTCFullYear() - 5)

export default (props: Props) => {
  const sectionProps: SectionProps = {
    id: 'interval',
    title: 'Interval',
    description: `Select an interval here`,
    numerate: true,
  }

  const max = new Date(defaultEnd)
  const min = new Date(0)

  const [state, setState] = createStore({
    start: defaultStart,
    end: defaultEnd,
  })

  createEffect(() => {
    props.setter(state.start, state.end)
  })

  return (
    <Section {...sectionProps}>
      <div class="space-y-2">
        <For
          each={[
            {
              key: 'start' as 'start' | 'end',
              icon: IconTablerArrowBarRight,
              pre: 'Start',
              title: 'Starting date',
              default: defaultStart,
            },
            {
              key: 'end' as 'start' | 'end',
              icon: IconTablerArrowBarToRight,
              pre: 'End',
              title: 'Ending date',
              default: defaultEnd,
            },
          ]}
        >
          {(obj) => (
            <DialogDate
              id={`${sectionProps.id}-${obj.key}`}
              button={{
                leftIcon: obj.icon,
                pre: obj.pre,
                text: state[obj.key]
                  .toUTCString()
                  .split(' ')
                  .slice(0, 4)
                  .join(' '),
              }}
              title={obj.title}
              value={state[obj.key]}
              reset={{
                default: obj.default,
                callback: () => setState(obj.key, obj.default),
              }}
              max={max}
              min={min}
              onClose={(value) => {
                if (value) {
                  setState(obj.key, new Date(value))
                }
              }}
            />
          )}
        </For>
      </div>
    </Section>
  )
}
