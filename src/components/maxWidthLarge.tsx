interface Props extends SolidJS.ParentProps {
  as?: string
  removeBorder?: boolean
  inverseBorder?: boolean
  class?: string
}

export default (props: Props) => {
  return (
    <Dynamic
      component={props.as || 'div'}
      class={`mx-auto max-w-5xl ${props.class || ''}`}
    >
      {props.children}
    </Dynamic>
  )
}
