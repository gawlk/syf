import { removeProps } from '/src/scripts'
import { defaultRounded } from './defaults'

import Icon from './icon'

export interface InteractiveProps extends SolidJS.ParentProps {
  // Full
  full?: boolean

  // Sizes
  lg?: boolean
  sm?: boolean

  // Round
  rounded?: boolean
  roundedFull?: boolean

  // Border
  border?: boolean

  // Center
  center?: boolean

  // Colors
  primary?: boolean
  secondary?: boolean
  tertiary?: boolean
  transparent?: boolean

  // States
  disabled?: boolean
  clickable?: boolean

  // Illustrations
  svg?: any
  leftSvg?: any
  rightSvg?: any
  src?: string
  leftSrc?: string
  rightSrc?: string

  // Classes
  class?: string
  illustrationClass?: string
  leftIllustrationClass?: string
  rightIllustrationClass?: string
}

export type InteractivePropsKeys = keyof Required<InteractiveProps>

export const propsSpecificToInteractive: {
  [T in InteractivePropsKeys]: boolean
} = {
  disabled: false,

  children: true,
  full: true,
  lg: true,
  sm: true,
  rounded: true,
  roundedFull: true,
  border: true,
  center: true,
  primary: true,
  secondary: true,
  tertiary: true,
  transparent: true,
  clickable: true,
  svg: true,
  leftSvg: true,
  rightSvg: true,
  src: true,
  leftSrc: true,
  rightSrc: true,
  class: true,
  illustrationClass: true,
  leftIllustrationClass: true,
  rightIllustrationClass: true,
}

interface Props extends InteractiveProps {
  // Element
  component: string | SolidJS.Component<any>
}

export default (props: Props) => {
  const dynamicProps = removeProps<Props>(props, propsSpecificToInteractive)

  const iconsProps = removeProps<Props>(props, {
    class: true,
  })

  return (
    <Dynamic
      {...dynamicProps}
      class={[
        // Full
        props.full ? 'w-full min-w-0' : '',

        // Sizes
        props.lg ? 'text-lg' : props.sm ? 'text-sm' : 'text-base',

        // Padding
        props.border || props.secondary // If has border
          ? props.lg
            ? 'p-3'
            : props.sm
            ? 'p-2'
            : 'p-2.5'
          : props.lg
          ? 'p-3.5'
          : props.sm
          ? 'p-2.5'
          : 'p-3',
        props.svg || props.src
          ? ''
          : props.border || props.secondary // If has border
          ? props.lg
            ? 'px-[1.875rem]'
            : props.sm
            ? 'px-3.5'
            : 'px-[1.375rem]'
          : props.lg
          ? 'px-8'
          : props.sm
          ? 'px-4'
          : 'px-6',

        // Rounded
        props.roundedFull
          ? 'rounded-full'
          : props.rounded ?? defaultRounded
          ? 'rounded-lg'
          : '',

        // Border
        props.border || props.secondary ? 'border-[3px]' : '',

        // Center
        props.center ? 'justify-center' : '',

        // Colors
        props.primary
          ? 'text-white dark:text-black'
          : props.secondary
          ? 'border-black dark:border-white dark:text-white'
          : props.border
          ? 'border-black border-opacity-5 hover:border-opacity-10 dark:border-white dark:text-white'
          : 'text-black dark:text-white',

        // Background colors
        props.primary
          ? 'bg-black dark:bg-white'
          : props.secondary || props.border || props.transparent
          ? 'bg-transparent'
          : 'bg-black bg-opacity-5 dark:bg-white',

        // Hover colors
        !props.disabled
          ? props.primary
            ? 'hover:bg-opacity-90'
            : props.secondary
            ? 'hover:bg-opacity-10'
            : props.transparent
            ? ''
            : 'hover:bg-opacity-10'
          : '',

        // Disabled
        props.disabled ? '' : 'group',

        // Clickable
        props.clickable ? 'clickable active:scale-95' : 'focusable',

        'z-10 inline-flex items-center disabled:opacity-60 disabled:transition-none',

        props.class || '',
      ].join(' ')}
    >
      <Show
        when={!props.svg && !props.src}
        fallback={
          <Icon
            {...iconsProps}
            svg={props.svg}
            src={props.src}
            class={props.illustrationClass}
          />
        }
      >
        <Show when={props.leftSvg || props.leftSrc}>
          <Icon
            {...iconsProps}
            svg={props.leftSvg}
            src={props.leftSrc}
            left={true}
            class={props.leftIllustrationClass}
          />
        </Show>

        {props.children}

        <Show
          when={
            props.rightSvg ||
            props.rightSrc ||
            (props.center && (props.leftSvg || props.leftSrc))
          }
        >
          <Icon
            {...iconsProps}
            svg={props.rightSvg}
            src={props.rightSrc}
            right={true}
            class={props.rightIllustrationClass}
          />
        </Show>
      </Show>
    </Dynamic>
  )
}
