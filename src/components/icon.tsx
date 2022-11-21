import { defaultRounded } from './defaults'

import { type InteractiveProps } from './interactive'

export interface Props extends InteractiveProps {
  // Illustrations
  icon?: string | ((...args: any[]) => SolidJS.JSXElement) | true

  // Sides
  left?: boolean
  right?: boolean
}

export default (props: Props) => {
  const isSpan = createMemo(
    () => !props.icon || typeof props.icon === 'boolean'
  )

  const isImage = createMemo(() => typeof props.icon === 'string')

  return (
    // TODO: Load image if in viewport
    <Dynamic
      // @ts-ignore next-line
      component={isSpan() ? 'span' : isImage() ? 'img' : props.icon}
      {...(isImage() ? { src: props.icon } : {})}
      style={props.style}
      class={[
        // Sizes
        props.lg
          ? 'h-[1.625rem] w-[1.625rem]'
          : props.sm
          ? 'h-5 w-5'
          : 'h-6 w-6',

        // Padding
        props.left
          ? props.lg
            ? '-ml-2 mr-2'
            : props.sm
            ? '-ml-1 mr-1'
            : '-ml-1.5 mr-1.5'
          : props.right
          ? props.lg
            ? 'ml-2 -mr-2'
            : props.sm
            ? 'ml-1 -mr-1'
            : 'ml-1.5 -mr-1.5'
          : '',

        ...(isImage()
          ? ['object-contain', defaultRounded ? 'rounded-md' : '']
          : [
              props.primary ? 'text-stone-500' : 'text-stone-400',
              props.disabled ? 'transition-none' : 'transition duration-200',
            ]),

        'flex-none',

        props.class || '',
      ].join(' ')}
    />
  )
}
