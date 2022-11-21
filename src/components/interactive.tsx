import {
  removeProps,
  convertRGBToBackgroundCSSRGB,
  convertRGBToOffTextCSSRGB,
  convertRGBToIconCSSRGB,
} from '/src/scripts'
import { styleToCSSProperties } from '/src/styles'
import { defaultRounded } from './defaults'

import Icon from './icon'

export interface InteractiveProps extends SolidJS.ParentProps {
  // Text
  pre?: string

  // Full
  full?: boolean

  // Sizes
  lg?: boolean
  sm?: boolean

  // Padding
  square?: boolean

  // Round
  rounded?: boolean
  roundedFull?: boolean

  // Border
  border?: boolean

  // Center
  center?: boolean

  // Color
  rgb?: RGB
  primary?: boolean
  secondary?: boolean
  tertiary?: boolean
  transparent?: boolean

  // State
  disabled?: boolean
  clickable?: boolean
  focusable?: boolean

  // Icons
  icon?: Icon
  leftIcon?: Icon
  rightIcon?: Icon

  // Classes
  class?: string
  iconClass?: string
  leftIconClass?: string
  rightIconClass?: string

  // Styles
  style?: string | SolidJS.JSXCSSProperties
  iconStyle?: string | SolidJS.JSXCSSProperties
  leftIconStyle?: string | SolidJS.JSXCSSProperties
  rightIconStyle?: string | SolidJS.JSXCSSProperties
}

export type InteractivePropsKeys = keyof Required<InteractiveProps>

export const propsSpecificToInteractive: {
  [T in InteractivePropsKeys]: boolean
} = {
  disabled: false,

  pre: true,
  children: true,
  full: true,
  lg: true,
  sm: true,
  square: true,
  rounded: true,
  roundedFull: true,
  border: true,
  center: true,
  rgb: true,
  primary: true,
  secondary: true,
  tertiary: true,
  transparent: true,
  clickable: true,
  focusable: true,
  icon: true,
  leftIcon: true,
  rightIcon: true,
  class: true,
  iconClass: true,
  leftIconClass: true,
  rightIconClass: true,
  style: true,
  iconStyle: true,
  leftIconStyle: true,
  rightIconStyle: true,
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

  const hasBorder = props.border || props.secondary

  const customColors = props.rgb
    ? {
        background: convertRGBToBackgroundCSSRGB(props.rgb),
        border: convertRGBToBackgroundCSSRGB(props.rgb),
        icon: convertRGBToIconCSSRGB(props.rgb),
        offText: convertRGBToOffTextCSSRGB(props.rgb),
      }
    : undefined

  const style: SolidJS.JSXCSSProperties = {
    ...(customColors?.background && props.clickable
      ? { 'background-color': customColors.background }
      : {}),
    ...(customColors?.border && hasBorder
      ? { 'border-color': customColors.border }
      : {}),
    ...styleToCSSProperties(props.style),
  }

  return (
    <Dynamic
      {...dynamicProps}
      style={style}
      class={[
        // Full
        props.full ? 'w-full min-w-0' : '',

        // Sizes
        props.lg ? 'text-lg' : props.sm ? 'text-sm' : 'text-base',

        // Padding
        hasBorder
          ? props.lg
            ? 'p-3'
            : props.sm
            ? 'p-2'
            : 'p-[0.5625rem]'
          : props.lg
          ? 'p-3.5'
          : props.sm
          ? 'p-2.5'
          : 'p-3',
        props.icon || props.square
          ? ''
          : hasBorder
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
          ? 'rounded-xl'
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
          ? 'border-stone-100'
          : 'text-black dark:text-white',

        // Background colors
        props.rgb || props.secondary || props.border
          ? ''
          : props.primary
          ? 'bg-black dark:bg-white'
          : 'bg-stone-100 dark:bg-stone-900',
        props.transparent ? 'bg-opacity-0' : '',

        // Hover colors
        !props.disabled
          ? props.primary
            ? 'hover:brightness-110'
            : 'hover:bg-opacity-100 hover:brightness-[0.925]'
          : '',

        // Disabled
        props.disabled
          ? 'opacity-60'
          : props.clickable || props.focusable
          ? `group ${props.clickable ? 'clickable' : 'focusable'}`
          : '',

        'z-10 inline-flex items-center',

        props.class || '',
      ]
        .flat()
        .join(' ')}
    >
      <Show
        when={!props.icon}
        fallback={
          <Icon
            {...iconsProps}
            icon={props.icon}
            class={props.iconClass}
            style={{
              ...(customColors?.icon ? { color: customColors.icon } : {}),
              ...styleToCSSProperties(props.iconStyle),
            }}
          />
        }
      >
        <Show when={props.leftIcon}>
          <Icon
            {...iconsProps}
            icon={props.leftIcon}
            left={true}
            class={props.leftIconClass}
            style={{
              ...(customColors?.icon ? { color: customColors.icon } : {}),
              ...styleToCSSProperties(props.leftIconStyle),
            }}
          />
        </Show>

        <Show when={props.pre}>
          <span
            class={[
              props.primary ? 'text-stone-400' : 'text-stone-500',
              'whitespace-pre-wrap',
            ].join(' ')}
            style={{
              ...(customColors?.offText ? { color: customColors.offText } : {}),
            }}
          >
            {props.pre}:{' '}
          </span>
        </Show>

        {props.children}

        <Show when={props.rightIcon || (props.center && props.leftIcon)}>
          <Icon
            {...iconsProps}
            icon={props.rightIcon}
            right={true}
            class={props.rightIconClass}
            style={{
              ...(customColors?.icon ? { color: customColors.icon } : {}),
              ...styleToCSSProperties(props.rightIconStyle),
            }}
          />
        </Show>
      </Show>
    </Dynamic>
  )
}
