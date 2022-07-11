import { defaultRounded } from './defaults'

import { type InteractiveProps } from './interactive'

export interface Props extends InteractiveProps {
  // Illustrations
  svg?: any
  src?: string

  // Sides
  left?: boolean
  right?: boolean
}

export default (props: Props) => {
  return (
    // TODO: Load image if in viewport
    <Dynamic
      component={props.src ? 'img' : props.svg || 'span'}
      src={props.src}
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

        ...(props.src
          ? ['object-contain', defaultRounded ? 'rounded-md' : '']
          : ['opacity-40 transition duration-200 group-hover:opacity-50']),

        'flex-none',

        props.class || '',
      ].join(' ')}
    />
  )
}
