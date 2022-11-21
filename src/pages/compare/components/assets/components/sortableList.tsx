// @ts-ignore
import { Sortable } from '@shopify/draggable'

interface Props extends SolidJS.ParentProps {
  onDragEnd: (oldIndex: number, newIndex: number) => void
  class?: string
}

export default (props: Props) => {
  let element: HTMLDivElement | undefined
  let sortable: any

  onMount(() => {
    sortable = new Sortable(element, {
      draggable: '.sortable',
      handle: '.handle',
      mirror: {
        constrainDimensions: true,
      },
    }).on('sortable:stop', (event: any) => {
      const { oldIndex, newIndex } = event.data

      if (oldIndex !== newIndex) {
        props.onDragEnd(oldIndex, newIndex)
      }
    })
  })

  onCleanup(() => {
    sortable?.destroy()
  })

  return (
    <div ref={element} class={props.class}>
      {props.children}
    </div>
  )
}
