import { removeProps } from '/src/scripts'

import Input, { type Props as InputProps } from '/src/components/input'

interface ComponentsProps {
  otherValues: number[]
}

type ComponentsPropsKeys = keyof Required<ComponentsProps>

const propsSpecificToComponent: { [T in ComponentsPropsKeys]: boolean } = {
  otherValues: true,
}

interface Props extends ComponentsProps, InputProps {}

export default (props: Props) => {
  const propsToSpread = removeProps<Props>(props, propsSpecificToComponent)

  const validValue = createMemo(() =>
    Math.min(
      Math.max(
        100 - props.otherValues.reduce((total, value) => total + value, 0),
        0
      ),
      100
    )
  )

  const disabled = createMemo(() => !props.otherValues.length)

  return (
    <Input
      {...propsToSpread}
      disabled={disabled()}
      value={disabled() ? 100 : props.value}
      max={validValue()}
      min={validValue()}
      step={1}
      full
    />
  )
}
