import Interactive, { type InteractiveProps } from './interactive'

export interface ButtonProps
  extends SolidJS.JSXButtonHTMLAttributes,
    InteractiveProps {}

export default (props: ButtonProps) => {
  return (
    <Interactive component={'button'} clickable {...props}>
      {props.children}
    </Interactive>
  )
}
