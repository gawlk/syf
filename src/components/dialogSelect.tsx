import { addLocationToID } from '/src/scripts'

import Button, { ButtonProps } from './button'
import Dialog, { type CustomDialogButtonProps } from './dialog'
import DialogSearchInput, {
  type Props as DialogSearchInputProps,
} from './dialogSearchInput'

interface ComponentsProps {
  id: string
  search?: Partial<DialogSearchInputProps>
  list: {
    selected: string | null
    values: string[]
    labels?: (string | SolidJS.JSXElement)[]
    icons?: (((...args: any[]) => SolidJS.JSXElement) | undefined)[]
  }
}

type ComponentsPropsKeys = keyof Required<ComponentsProps>

const propsSpecificToComponent: { [T in ComponentsPropsKeys]: boolean } = {
  id: true,
  search: true,
  list: true,
}

interface Props extends ComponentsProps, SolidJS.ParentProps {
  button: CustomDialogButtonProps
  title: string
  onClose: (value?: string) => void
}

export default (props: Props) => {
  const [state, setState] = createStore({
    input: undefined as string | undefined,
  })

  const id = addLocationToID(props.id)

  const saved = localStorage.getItem(id)

  if (saved) {
    props.onClose(saved)
  }

  return (
    <Dialog
      title={props.title}
      button={mergeProps(props.button, {
        id,
        role: 'listbox' as const,
        full: props.button.full ?? true,
        rightIcon: IconTablerSelector,
        rightIconClass: '',
      } as ButtonProps)}
      onClose={(value?: string) => {
        if (value) {
          localStorage.setItem(id, value)
        } else {
          localStorage.removeItem(id)
        }

        props.onClose(value)
      }}
      sticky={
        props.search ? (
          <DialogSearchInput
            {...props.search}
            onInput={(value?: string) => {
              setState('input', value)
            }}
          />
        ) : undefined
      }
    >
      <div class="space-y-2">
        <For
          each={(props.list.values || [])
            .map((value, index) => {
              return {
                value,
                label: props.list.labels?.at(index) || value,
                icon: props.list.icons?.[index] || undefined,
              }
            })
            .filter(
              (obj) =>
                !state.input ||
                (typeof obj.label === 'string'
                  ? obj.label
                  : // @ts-ignore next-line
                    obj.label.textContent
                )
                  .toLowerCase()
                  .includes(state.input.toLowerCase())
            )}
        >
          {(obj) => {
            const checkIcon = IconTablerCheck

            return (
              <Button
                full
                leftIcon={props.list.selected === obj.value ? checkIcon : true}
                rightIcon={obj.icon}
                value={obj.value}
              >
                <span class="w-full truncate text-left">{obj.label}</span>
              </Button>
            )
          }}
        </For>
      </div>
    </Dialog>
  )
}
