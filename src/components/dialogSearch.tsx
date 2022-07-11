import { debounce } from '/src/scripts'

import Dialog, { type CustomDialogButtonProps } from './dialog'
import Divider from './divider'
import Input from './input'

interface Props extends SolidJS.ParentProps {
  title: string
  button: CustomDialogButtonProps
  pre: string
  placeholder: string
  value: string
  onInput: (value: string) => void
  onClose: (value?: string) => void
}

export default (props: Props) => {
  const buttonProps = mergeProps(props.button, {
    full: props.button.full ?? true,
    leftSvg: props.button.leftSvg ?? IconTablerListSearch,
  })

  return (
    <Dialog
      title={props.title}
      button={buttonProps}
      onClose={props.onClose}
      sticky={() => (
        <>
          <Input
            leftSvg={IconTablerListSearch}
            pre={props.pre}
            placeholder={props.placeholder}
            value={props.value}
            class="flex-none"
            onInput={debounce((event: InputEvent) => {
              props.onInput((event.target as HTMLInputElement).value)
            })}
          />
          <Divider class="my-4 flex-none" />
        </>
      )}
    >
      <div class="space-y-2">{props.children}</div>
    </Dialog>
  )
}
