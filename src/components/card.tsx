import { Link } from 'solid-app-router'

interface Props extends SolidJS.ParentProps {
  url?: string
  gray?: true
  gold?: true
  silver?: true
  sunset?: true
  style?: string | SolidJS.JSXCSSProperties
  loading?: boolean
  class?: string
}

export default (props: Props) => {
  return (
    <Dynamic
      component={props.url ? Link : 'div'}
      href={props.url || ''}
      style={props.style}
      class={[
        props.gray
          ? 'bg-stone-100'
          : props.gold
          ? 'bg-[#e9c573]'
          : props.silver
          ? 'bg-[#c3d6d6]'
          : props.sunset
          ? 'bg-[#d99881]'
          : '',
        props.loading ? 'animate-pulse' : '',
        props.url ? 'clickable group active:scale-95' : '',
        'relative z-10 overflow-hidden rounded-3xl p-4',
        props.class,
      ].join(' ')}
    >
      {props.children}
    </Dynamic>
  )
}
