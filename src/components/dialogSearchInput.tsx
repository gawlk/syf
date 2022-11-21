import Divider from './divider'
import Input, { type Props as InputProps } from './input'

export interface Props extends InputProps {}

export default (props: Props) => {
  return (
    <>
      <Input
        leftIcon={IconTablerListSearch}
        pre="Name"
        {...props}
        class={`${props.class} flex-none`}
        onInput={props.onInput || (() => {})}
      />
      <Divider class="my-4 flex-none" />
    </>
  )
}
