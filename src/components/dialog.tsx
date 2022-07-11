import { removeProps } from '/src/scripts'

import Button, { type ButtonProps } from './button'
import Divider from './divider'

interface DialogButtonProps {
  text?: string
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
  onClose?: (value?: string) => void
}

type ComponentsPropsKeys = keyof Required<ComponentsProps>

const propsSpecificToComponent: { [T in ComponentsPropsKeys]: boolean } = {
  button: true,
  sticky: true,
  title: true,
  onClose: true,
}

interface Props extends ComponentsProps, SolidJS.JSXDialogHTMLAttributes {}

// TODO: https://tympanus.net/codrops/2021/10/06/how-to-implement-and-style-the-dialog-element/

export default (props: Props) => {
  let dialog: HTMLDialogElement | undefined

  const buttonProps = removeProps(props.button, propsSpecificToDialogButton)

  const dialogProps = removeProps(props, propsSpecificToComponent)

  return (
    <div>
      <Button
        {...buttonProps}
        rightSvg={IconTablerChevronRight}
        rightIllustrationClass="group-hover:translate-x-1 will-change-transform"
        onClick={() => dialog?.showModal()}
      >
        <span class="flex-1 text-left">{props.button.text}</span>
      </Button>
      {/* TODO: Catch ESC so that the event isn't spread to the OS */}
      <dialog
        // @ts-ignore next-line
        on:close={(event) => {
          const returnValue = event.target.returnValue || undefined

          props.onClose?.(returnValue)
        }}
        {...dialogProps}
        ref={dialog}
        class="mt-[5vh] h-[95vh] w-full max-w-full flex-col space-y-4 rounded-t-xl p-6 pb-0 backdrop:bg-black/25 open:flex md:mt-[10vh] md:h-fit md:max-h-[32rem] md:max-w-2xl md:rounded-b-xl"
      >
        <div class="flex items-center space-x-2">
          <Button sm svg={IconTablerX} onClick={() => dialog?.close('')} />
          <h2 class="flex-1 text-center text-xl">{props.title}</h2>
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
