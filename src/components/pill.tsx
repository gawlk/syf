import { ParentProps } from 'solid-js'

interface Props extends ParentProps {
  green?: boolean
  red?: boolean
  class?: string
  sm?: boolean
}

export default (props: Props) => {
  return (
    <div
      class={[
        props.sm ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-sm',
        props.green
          ? 'border-green-700 bg-green-200 text-green-800'
          : props.red
          ? 'border-red-700 bg-red-200 text-red-800'
          : 'border-stone-700 bg-stone-200 text-stone-800',
        props.class || '',
        'rounded-full border-2 border-opacity-75 bg-opacity-50  font-semibold',
      ].join(' ')}
    >
      {props.children}
    </div>
  )
}
