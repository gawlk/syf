import splitjs from 'split.js'

import { createEditor } from './scripts/monaco'

export default () => {
  let panel1: HTMLDivElement | undefined
  let editor: HTMLDivElement | undefined
  let panel2: HTMLDivElement | undefined

  onMount(() => {
    splitjs([panel1 as HTMLElement, panel2 as HTMLElement])

    createEditor(editor as HTMLElement)
  })

  return (
    <div class="flex">
      <div ref={panel1}>
        <div ref={editor} />
      </div>
      <div ref={panel2}>Chart</div>
    </div>
  )
}
