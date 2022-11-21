import Title from './title'

export interface Props extends SolidJS.ParentProps {
  label: string | SolidJS.JSXElement
  class?: string
}

export default (props: Props) => {
  const id = `labeled-${Math.random()}`

  return (
    <div>
      <label for={id}>
        <Title level={6} margin>
          {props.label}
        </Title>
      </label>
      <div id={id} class={props.class ?? 'space-y-2'}>
        {props.children}
      </div>
    </div>
  )
}
