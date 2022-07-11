interface Props {
  backgroundColor: string
}

export default (props: Props) => {
  return (
    <div
      class="w-[3px] flex-none brightness-[0.8]"
      style={props.backgroundColor}
    />
  )
}
