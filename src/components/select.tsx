import { filterPropsKeys, removeProps } from '/src/scripts'

import Interactive, {
  propsSpecificToInteractive,
  type InteractiveProps,
} from './interactive'

interface ComponentsProps {
  values: string[]
  labels?: string[]
  selected?: string
  resetOnChange?: boolean
  placeholder?: string
  image?: string
}

type ComponentsPropsKeys = keyof Required<ComponentsProps>

const propsSpecificToComponent: { [T in ComponentsPropsKeys]: boolean } = {
  values: true,
  labels: true,
  selected: true,
  resetOnChange: true,
  placeholder: true,
  image: true,
}

interface Props
  extends ComponentsProps,
    SolidJS.JSXSelectHTMLAttributes,
    InteractiveProps {}

export default (props: Props) => {
  const propsToSpread = removeProps<Props>(
    mergeProps(props, {
      full: props.full ?? true,
      rightIcon: IconTablerSelector,
      class: props.class + ' relative',
    } as Props),
    propsSpecificToComponent
  )

  const [interactiveProps, elementProps] = splitProps(
    propsToSpread,
    filterPropsKeys(propsToSpread, propsSpecificToInteractive)
  )

  return (
    <Interactive component={'div'} focusable {...interactiveProps}>
      <span class="flex-1 truncate">
        {props.selected
          ? (props.labels || props.values).at(
              props.values.indexOf(props.selected)
            )
          : props.placeholder}
      </span>
      <select
        {...elementProps}
        class={[
          props.roundedFull ? 'rounded-full' : 'rounded-lg',
          'focusable absolute inset-0 z-20 w-full cursor-pointer bg-transparent text-transparent',
        ].join(' ')}
      >
        <Show when={props.placeholder}>
          <option value="" class="text-black">
            {props.placeholder}
          </option>
        </Show>
        <For each={props.values}>
          {(value, index) => {
            const label = props.labels?.at(index()) || value

            return (
              <option
                value={value}
                selected={props.selected === value}
                class="text-black"
              >
                {label}
              </option>
            )
          }}
        </For>
      </select>
    </Interactive>
  )
}
