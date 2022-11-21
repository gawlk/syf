import {
  createSelectableList,
  getOrdinalDay,
  getWeekDay,
  getWeekDays,
} from '/src/scripts'

import DialogSelect from '/src/components/dialogSelect'
import Section, { type Props as SectionProps } from '/src/components/section'

interface Option {
  value: string | number
  label: string
  isDateAnInvestmentDay: IsDateAnInvestmentDay
}

interface Props {
  setter: (isDateAnInvestmentDay: IsDateAnInvestmentDay) => void
}

export default (props: Props) => {
  const sectionProps: SectionProps = {
    id: 'frequency',
    title: 'Frequency',
    description: `Select a timeframe here`,
    numerate: true,
  }

  const maxDays = 28

  const weekDays = getWeekDays()

  const isNumberBetweenCurrentAndPrevious = (
    day: number,
    current: number,
    previous?: number
  ) =>
    !previous
      ? current === day
      : current >= day && (previous < day || previous > current)

  const timeframes = [
    {
      value: 'daily',
      label: 'Every day',
    },
    {
      value: 'weekly',
      label: 'Every week',
      options: {
        selectableList: createSelectableList(
          weekDays.map((label, value): Option => {
            value++

            return {
              value,
              label,
              isDateAnInvestmentDay: (currentDate: Date, previousDate?: Date) =>
                isNumberBetweenCurrentAndPrevious(
                  weekDays.indexOf(label),
                  weekDays.indexOf(getWeekDay(currentDate)),
                  previousDate
                    ? weekDays.indexOf(getWeekDay(previousDate))
                    : undefined
                ),
            }
          })
        ),
      },
    },
    {
      value: 'biweekly',
      label: 'Every two weeks',
      options: {
        buttonPre: 'Pair',
        dialogTitle: 'Select a pair',
        selectableList: createSelectableList(
          [...Array(Math.round(maxDays / 2)).keys()].map((day): Option => {
            const day1 = day + 1
            const day2 = day + 15

            return {
              value: `${day1}+${day2}`,
              label: `The ${getOrdinalDay(day1)} and the ${getOrdinalDay(
                day2
              )}`,
              isDateAnInvestmentDay: (currentDate: Date, previousDate?: Date) =>
                isNumberBetweenCurrentAndPrevious(
                  day1,
                  currentDate.getUTCDate(),
                  previousDate?.getUTCDate()
                ) ||
                isNumberBetweenCurrentAndPrevious(
                  day2,
                  currentDate.getUTCDate(),
                  previousDate?.getUTCDate()
                ),
            }
          })
        ),
      },
    },
    {
      value: 'monthly',
      label: 'Every month',
      options: {
        selectableList: createSelectableList(
          [...Array(maxDays).keys()].map((day): Option => {
            day++

            return {
              value: day,
              label: `The ${getOrdinalDay(day)}`,
              isDateAnInvestmentDay: (currentDate: Date, previousDate?: Date) =>
                isNumberBetweenCurrentAndPrevious(
                  day,
                  currentDate.getUTCDate(),
                  previousDate?.getUTCDate()
                ),
            }
          })
        ),
      },
    },
  ]

  const [state, setState] = createStore(
    createSelectableList(timeframes, {
      selected: 1,
    })
  )

  createEffect(() => {
    props.setter(
      state.selected?.options?.selectableList.selected?.isDateAnInvestmentDay ||
        (() => true)
    )
  })

  return (
    <Section {...sectionProps}>
      <div class="space-y-2">
        <DialogSelect
          id={`${sectionProps.id}-choice`}
          button={{
            leftIcon: IconTablerCalendar,
            pre: 'Frequency',
            text: state.selected?.label,
          }}
          title="Select a frenquency"
          list={{
            selected: state.selected?.value || '',
            values: state.list.map((timeframe) => timeframe.value),
            labels: state.list.map((timeframe) => timeframe.label),
          }}
          onClose={(value?: string) => {
            if (value) {
              setState({
                selected:
                  state.list.find((timeframe) => timeframe.value === value) ??
                  null,
              })
            }
          }}
        />
        <Show when={state.selected?.options}>
          <DialogSelect
            id={`${sectionProps.id}-option`}
            button={{
              leftIcon: IconTablerAlarm,
              pre: state.selected?.options?.buttonPre || 'Day',
              text: state.selected?.options?.selectableList.selected?.label,
            }}
            title={state.selected?.options?.dialogTitle || `Select a day`}
            list={{
              selected: String(
                state.selected?.options?.selectableList.selected?.value
              ),
              values:
                state.selected?.options?.selectableList.list.map((option) =>
                  String(option.value)
                ) || [],
              labels: state.selected?.options?.selectableList.list.map(
                (option) => option.label
              ),
            }}
            onClose={(value?: string) => {
              if (value) {
                const selectedOption =
                  state.selected?.options?.selectableList.list?.find(
                    (option) => option.value == value
                  )

                if (selectedOption) {
                  setState('selected', 'options', 'selectableList', {
                    selected: selectedOption,
                  })
                }
              }
            }}
          />
        </Show>
      </div>
    </Section>
  )
}
