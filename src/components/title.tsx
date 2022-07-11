export interface Props extends SolidJS.ParentProps {
  level: number
  margin?: boolean
  class?: string
}

export default (props: Props) => {
  return (
    <Dynamic
      component={`h${props.level}`}
      class={[
        Number(props.level) === 1
          ? 'text-5xl'
          : Number(props.level) === 2
          ? 'text-4xl'
          : Number(props.level) === 3
          ? 'text-3xl'
          : Number(props.level) === 4
          ? 'text-2xl'
          : Number(props.level) === 5
          ? 'text-xl'
          : 'text-lg',
        props.margin ? 'mt-6 mb-4 first:mt-2' : '',
        'break-words font-extrabold tracking-tight text-black',
        props.class || '',
      ].join(' ')}
    >
      {props.children}
    </Dynamic>
  )
}
