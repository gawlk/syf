import { filterPropsKeys, removeProps } from '/src/scripts'

import Interactive, {
  propsSpecificToInteractive,
  type InteractiveProps,
} from './interactive'

interface ComponentsProps {
  datalist?: string[]
  pre?: string
}

type ComponentsPropsKeys = keyof Required<ComponentsProps>

const propsSpecificToComponent: { [T in ComponentsPropsKeys]: boolean } = {
  datalist: true,
  pre: true,
}

interface Props
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
      class: props.class + ' [&:has(input:invalid)]:border-red-500',
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

  const updatePadding = () => {
    if (input && span) {
      input.style.paddingLeft = `${span.offsetLeft || 0}px`
      input.style.paddingRight = `${
        input.offsetWidth - span.offsetWidth - span.offsetLeft || 0
      }px`
    }
  }

  const datalistID = createMemo(() => `${props.id}-datalist`)

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
    // Relative can't be added to the Interactive element because of the border
    <div class="relative">
      <Interactive component={'div'} {...interactiveProps}>
        <Show when={props.pre}>
          <span class="whitespace-pre-wrap text-black text-opacity-50 group-hover:text-opacity-60">
            {props.pre}:{' '}
          </span>
        </Show>
        <span ref={span} class="flex-1" />
        <input
          ref={input}
          {...elementProps}
          list={props.datalist ? datalistID() : undefined}
          class="focusable absolute inset-0 z-20 h-full w-full rounded-lg bg-transparent text-left invalid:text-red-600"
        />
        <Show when={props.datalist}>
          <datalist id={datalistID()}>
            <For each={props.datalist}>
              {(value) => <option value={value} />}
            </For>
          </datalist>
        </Show>
      </Interactive>
    </div>
  )
}
