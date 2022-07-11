interface Props extends SolidJS.ParentProps {
  level?: number
}

export default (props: Props) => {
  return (
    <p
      class={[
        Number(props.level) === 1
          ? 'text-2xl sm:text-3xl'
          : Number(props.level) === 2
          ? 'text-xl sm:text-2xl'
          : Number(props.level) === 3
          ? 'text-lg sm:text-xl'
          : Number(props.level) === 4
          ? 'text-base sm:text-lg'
          : Number(props.level) === 5
          ? 'text-sm sm:text-base'
          : 'text-xs sm:text-sm',
        'font-normal leading-relaxed text-black text-opacity-50',
      ].join(' ')}
    >
      {props.children}
    </p>
  )
}
