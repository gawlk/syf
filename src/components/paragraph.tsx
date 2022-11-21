interface Props extends SolidJS.ParentProps {
  level?: number
}

export default (props: Props) => {
  return (
    <p
      class={[
        Number(props.level) === 1
          ? 'text-2xl md:text-3xl'
          : Number(props.level) === 2
          ? 'text-xl md:text-2xl'
          : Number(props.level) === 3
          ? 'text-lg md:text-xl'
          : Number(props.level) === 4
          ? 'text-base md:text-lg'
          : Number(props.level) === 5
          ? 'text-sm md:text-base'
          : 'text-xs md:text-sm',
        'font-normal leading-relaxed text-black text-opacity-50',
      ].join(' ')}
    >
      {props.children}
    </p>
  )
}
