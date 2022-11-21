import { removeProps } from '/src/scripts'

import Button, { type ButtonProps } from './button'
import Divider from './divider'

interface DialogButtonProps {
  text?: string | SolidJS.JSXElement
}

type DialogButtonPropsKeys = keyof Required<DialogButtonProps>

const propsSpecificToDialogButton: { [T in DialogButtonPropsKeys]: boolean } = {
  text: true,
}

export interface CustomDialogButtonProps
  extends ButtonProps,
    DialogButtonProps {}

interface ComponentsProps {
  button: CustomDialogButtonProps
  sticky?: SolidJS.JSXElement
  title?: string
  full?: true
  onClose?: (value?: string) => void
}

type ComponentsPropsKeys = keyof Required<ComponentsProps>

const propsSpecificToComponent: { [T in ComponentsPropsKeys]: boolean } = {
  button: true,
  sticky: true,
  title: true,
  full: true,
  onClose: true,
}

interface Props extends ComponentsProps, SolidJS.JSXDialogHTMLAttributes {}

// TODO: https://tympanus.net/codrops/2021/10/06/how-to-implement-and-style-the-dialog-element/

export default (props: Props) => {
  let dialog: HTMLDialogElement | undefined

  const buttonProps = createMemo(() =>
    mergeProps(removeProps(props.button, propsSpecificToDialogButton), {
      rightIcon: props.button.rightIcon ?? IconTablerChevronRight,
      rightIconClass:
        props.button.rightIconClass ??
        'group-hover:translate-x-1 will-change-transform',
    })
  )

  const dialogProps = createMemo(() =>
    removeProps(props, propsSpecificToComponent)
  )

  return (
    <div class={props.button.full ? 'w-full' : ''}>
      <Button {...buttonProps()} onClick={() => dialog?.showModal()}>
        <span class="flex-1 text-left">{props.button.text}</span>
      </Button>
      <dialog
        // @ts-ignore next-line
        on:close={(event) => {
          const returnValue = event.target.returnValue || undefined

          props.onClose?.(returnValue)
        }}
        {...dialogProps()}
        ref={dialog}
        class={[
          props.full ? 'h-full' : '',
          'top-auto bottom-0 mt-[5vh] max-h-[95vh] w-full max-w-full flex-col space-y-4 rounded-t-2xl p-6 pb-0 backdrop:bg-black/25 open:flex md:top-[10vh] md:mt-0 md:h-fit md:max-h-[32rem] md:max-w-2xl md:rounded-b-2xl',
        ].join(' ')}
      >
        <div class="relative flex items-center space-x-2">
          <Button
            sm
            icon={IconTablerX}
            onClick={() => dialog?.close('')}
            class="absolute inset-y-0 left-0 -m-1.5"
          />
          <h2 class="flex-1 text-center text-xl font-semibold">
            {props.title}
          </h2>
        </div>
        <Divider />
        {props.sticky}
        <form
          method="dialog"
          class="!my-0 -mx-4 flex-1 overflow-y-auto p-4 pb-6"
        >
          {props.children}
        </form>
      </dialog>
    </div>
  )
}
