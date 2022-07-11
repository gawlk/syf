interface Props {
  class?: string
}

export default (props: Props) => {
  return (
    <hr
      class={[
        props.class || '',
        '-mx-6 my-4 flex-none border-b-2 border-black border-opacity-5',
      ].join(' ')}
    />
  )
}
