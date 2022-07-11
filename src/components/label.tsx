export interface Props extends SolidJS.ParentProps {
  label: string
  for: string
}

export default (props: Props) => {
  return (
    <div class="w-full space-y-1">
      <label for={props.for} class="ml-2 font-medium text-stone-500">
        {props.label}
      </label>
      {props.children}
    </div>
  )
}
