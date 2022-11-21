import { addLocationToID } from '/src/scripts'

interface Props extends SolidJS.ParentProps, SolidJS.JSXDetailsHTMLAttributes {
  summary: SolidJS.JSXElement
}

export default (props: Props) => {
  let defaultOpen = true

  const [state, setState] = createStore({
    open: defaultOpen,
  })

  let id: string | undefined
  let details: HTMLDetailsElement | undefined

  if (props.id) {
    id = addLocationToID(`${props.id}-details`)

    const saved = localStorage.getItem(id)

    if (saved) {
      defaultOpen = saved === 'false' ? false : true
      setState('open', defaultOpen)
    }
  }

  const IconPlus = IconTablerPlus
  const IconMinus = IconTablerMinus

  return (
    <details
      {...props}
      id={id}
      ref={details}
      open={defaultOpen}
      onToggle={() => {
        if (details) {
          const open = details.open

          setState('open', open)

          id && localStorage.setItem(id, String(open))
        }
      }}
    >
      <summary class="group flex cursor-pointer items-center">
        <div class="w-full">{props.summary}</div>
        <Dynamic
          component={state.open ? IconPlus : IconMinus}
          class="h-6 w-6 flex-none text-stone-400 transition-colors duration-200 group-hover:text-stone-500"
        />
      </summary>
      {props.children}
    </details>
  )
}
