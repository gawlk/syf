import {
  addLocationToID,
  getWeekDay,
  getWeekDays,
  getMonths,
} from '/src/scripts'

import Button, { ButtonProps } from './button'
import ButtonDivider from './buttonDivider'
import Dialog, { type CustomDialogButtonProps } from './dialog'

interface ComponentsProps {
  id: string
  value: Date
  max?: Date
  min?: Date
  reset?: {
    default: Date
    callback: () => void
  }
}

type ComponentsPropsKeys = keyof Required<ComponentsProps>

const propsSpecificToComponent: { [T in ComponentsPropsKeys]: boolean } = {
  id: true,
  value: true,
  max: true,
  min: true,
  reset: true,
}

interface Props extends ComponentsProps, SolidJS.ParentProps {
  button: CustomDialogButtonProps
  title: string
  onClose: (value?: string) => void
}

export default (props: Props) => {
  const [state, setState] = createStore({
    year: 0,
    month: 0,
    weeks: [] as Date[][],
  })

  const id = addLocationToID(props.id)

  const saved = localStorage.getItem(id)

  if (saved) {
    props.onClose(saved)
  }

  const weekDays = getWeekDays()
  const months = getMonths()

  const setWeeks = (year: number, month: number) => {
    const firstDate = new Date(Date.UTC(year, month))

    let date = new Date(firstDate)
    let dates: Date[] = []

    do {
      dates = [new Date(date), ...dates]
      date.setUTCDate(date.getUTCDate() - 1)
    } while (getWeekDay(date) !== weekDays.at(-1))

    dates.pop()

    date = new Date(firstDate)

    do {
      dates.push(new Date(date))
      date.setUTCDate(date.getUTCDate() + 1)
    } while (
      date.getUTCMonth() === state.month ||
      getWeekDay(date) !== weekDays[0]
    )

    const weeks: Date[][] = []
    while (dates.length) {
      weeks.push(dates.splice(0, 7))
    }

    setState('weeks', weeks)
  }

  const isMaxYear = createMemo(
    () => props.max && state.year >= props.max.getUTCFullYear()
  )

  const isMaxMonth = createMemo(
    () => isMaxYear() && props.max && state.month >= props.max.getUTCMonth()
  )

  const isMinYear = createMemo(
    () => props.min && state.year <= props.min.getUTCFullYear()
  )

  const isMinMonth = createMemo(
    () => isMinYear() && props.min && state.month <= props.min.getUTCMonth()
  )

  const showReset = createMemo(
    () =>
      props.reset && props.value.valueOf() !== props.reset?.default.valueOf()
  )

  createEffect(() => {
    setState({
      year: props.value.getUTCFullYear(),
      month: props.value.getUTCMonth(),
    })
  })

  createEffect(() => {
    setWeeks(state.year, state.month)
  })

  return (
    <div class="flex">
      <Dialog
        title={props.title}
        button={mergeProps(props.button, {
          id,
          role: 'listbox' as const,
          full: props.button.full ?? true,
          rightIcon: IconTablerCalendar,
          rightIconClass: '',
          class: `${showReset() ? 'rounded-r-none' : ''} ${props.button.class}`,
        } as ButtonProps)}
        onClose={(value?: string) => {
          if (value && value !== props.reset?.default.toJSON()) {
            localStorage.setItem(id, value)
          } else {
            localStorage.removeItem(id)
          }

          props.onClose(value)
        }}
      >
        <div>
          <div class="space-y-2 px-4 sm:flex sm:space-y-0 sm:space-x-16 sm:px-6">
            <div class="flex w-full items-center space-x-4">
              <Button
                sm
                icon={IconTablerChevronLeft}
                disabled={isMinMonth()}
                onClick={(event) => {
                  event?.preventDefault()

                  if (!state.month) {
                    setState({
                      year: state.year - 1,
                      month: months.length - 1,
                    })
                  } else {
                    setState('month', (month) => month - 1)
                  }
                }}
              />
              <span class="flex-1 text-center text-xl font-medium">
                {months[state.month]}
              </span>
              <Button
                sm
                icon={IconTablerChevronRight}
                disabled={isMaxMonth()}
                onClick={(event) => {
                  event?.preventDefault()

                  if (state.month === months.length - 1) {
                    setState({
                      year: state.year + 1,
                      month: 0,
                    })
                  } else {
                    setState('month', (month) => month + 1)
                  }
                }}
              />
            </div>

            <div class="flex w-full items-center space-x-4">
              <Button
                sm
                icon={IconTablerMinus}
                disabled={isMinYear()}
                onClick={(event) => {
                  event?.preventDefault()
                  setState('year', (year) => year - 1)
                }}
              />
              <span class="flex-1 text-center text-xl font-medium">
                {state.year}
              </span>
              <Button
                sm
                icon={IconTablerPlus}
                disabled={isMaxYear()}
                onClick={(event) => {
                  event?.preventDefault()
                  setState('year', (year) => year + 1)

                  if (
                    props.max &&
                    state.year >= props.max.getUTCFullYear() &&
                    state.month > props.max.getUTCMonth()
                  ) {
                    setState('month', props.max.getUTCMonth())
                  }
                }}
              />
            </div>
          </div>
          <table class="w-full table-fixed border-separate border-spacing-0.5">
            <thead>
              <tr>
                <For each={weekDays}>
                  {(weekDay) => (
                    <th class="w-6 p-2.5 text-black/50">
                      <span class="md:hidden">{weekDay[0]}</span>
                      <span class="hidden md:inline">
                        {weekDay.slice(0, 3)}
                      </span>
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={state.weeks}>
                {(week) => (
                  <tr>
                    <For each={week}>
                      {(date) => {
                        const isValue = createMemo(
                          () => props.value.valueOf() === date.valueOf()
                        )

                        return (
                          <td>
                            <div class="flex items-center justify-center">
                              <Button
                                primary={isValue()}
                                transparent={!isValue()}
                                value={date.toJSON()}
                                disabled={
                                  (props.max && date > props.max) ||
                                  (props.min && date < props.min)
                                }
                                square
                                class="p-2.5"
                              >
                                <span
                                  class={[
                                    !isValue() &&
                                    date.getUTCMonth() !== state.month
                                      ? 'text-black/50'
                                      : '',
                                    'w-6',
                                  ].join(' ')}
                                >
                                  {date.getUTCDate()}
                                </span>
                              </Button>
                            </div>
                          </td>
                        )
                      }}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Dialog>
      <Show when={showReset()}>
        <ButtonDivider />
        <Button
          icon={IconTablerArrowBack}
          onClick={() => {
            localStorage.removeItem(id)

            props.reset?.callback()
          }}
          class="rounded-l-none"
        />
      </Show>
    </div>
  )
}
