import {
  filterPropsKeys,
  removeProps,
  addLocationToID,
  debounce,
  getDefaultDebounceWaitBasedOnCallback,
} from '/src/scripts'

import Button from './button'
import ButtonDivider from './buttonDivider'
import Interactive, {
  propsSpecificToInteractive,
  type InteractiveProps,
} from './interactive'

interface ComponentsProps {
  onInput: (value?: string, event?: InputEvent) => void
  id?: string
  debounce?: number
}

type ComponentsPropsKeys = keyof Required<ComponentsProps>

const propsSpecificToComponent: { [T in ComponentsPropsKeys]: boolean } = {
  id: true,
  onInput: true,
  debounce: true,
}

// @ts-ignore next-line
export interface Props
  extends ComponentsProps,
    SolidJS.JSXInputHTMLAttributes,
    InteractiveProps {}

export default (props: Props) => {
  const propsToSpread = removeProps<Props>(
    mergeProps(props, {
      full: true,
      border: true,
      type:
        props.type || (typeof props.value === 'number' ? 'number' : undefined),
    } as Props),
    propsSpecificToComponent
  )

  const [interactiveProps, elementProps] = splitProps(
    propsToSpread,
    filterPropsKeys(propsToSpread, propsSpecificToInteractive)
  )

  let span: HTMLSpanElement | undefined
  let input: HTMLInputElement | undefined
  let observer: IntersectionObserver | undefined
  let id: string | undefined

  if (props.id) {
    id = addLocationToID(props.id)

    const saved = localStorage.getItem(id)

    saved && String(saved) !== String(props.value) && props.onInput(saved)
  }

  const updatePadding = () => {
    if (input && span) {
      input.style.paddingLeft = `${span.offsetLeft || 0}px`
      input.style.paddingRight = `${
        input.offsetWidth - span.offsetWidth - span.offsetLeft || 0
      }px`
    }
  }

  const save = (value: string) => {
    if (id) {
      value ? localStorage.setItem(id, value) : localStorage.removeItem(id)
    }
  }

  const needsFixing = createMemo(
    () =>
      !props.disabled &&
      (props.max !== undefined || props.min !== undefined) &&
      (props.value === undefined ||
        (props.max !== undefined && props.value > props.max) ||
        (props.min !== undefined && props.value < props.min))
  )

  onMount(async () => {
    updatePadding()

    await document.fonts.ready

    updatePadding()

    if (input?.style.paddingLeft === '0px') {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].boundingClientRect.height) {
          updatePadding()
          observer?.disconnect()
        }
      })

      if (input) {
        observer.observe(input)
      }
    }
  })

  onCleanup(() => {
    observer?.disconnect()
  })

  return (
    <div class="flex">
      <Interactive
        component={'div'}
        focusable
        {...interactiveProps}
        class={[
          'relative',
          needsFixing() ? 'rounded-r-none' : '',
          props.class || '',
          '[&:has(input:invalid)]:border-red-500',
        ].join(' ')}
      >
        <span ref={span} class="flex-1" />
        <input
          id={id}
          ref={input}
          onInput={debounce((event: InputEvent) => {
            const element = event.target as HTMLInputElement

            const value = element.value

            save(value)

            props.onInput(value, event)
          }, props.debounce || getDefaultDebounceWaitBasedOnCallback(props.onInput))}
          {...elementProps}
          class="absolute inset-0 z-20 h-full w-full bg-transparent text-left invalid:text-red-600 focus:outline-none"
        />
      </Interactive>
      <Show when={needsFixing()}>
        <ButtonDivider rgb={props.rgb} />
        <Button
          icon={IconTablerHammer}
          rgb={props.rgb}
          class={[props.class, needsFixing() ? 'rounded-l-none' : ''].join(' ')}
          onClick={() => {
            if (
              props.value === undefined ||
              (props.min !== undefined && props.value < props.min)
            ) {
              save(String(props.min))
              props.onInput(String(props.min))
            } else {
              save(String(props.max))
              props.onInput(String(props.max))
            }
          }}
        />
      </Show>
    </div>
  )
}
