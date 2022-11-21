import Details from './details'
import Paragraph from './paragraph'
import Title from './title'

export interface Props extends SolidJS.ParentProps {
  id: string
  title: string | SolidJS.JSXElement
  description?: string | SolidJS.JSXElement
  numerate?: boolean
}

export default (props: Props) => {
  const level = 4

  const [number, setNumber] = createSignal(0)

  let section: HTMLElement | undefined

  if (props.numerate) {
    onMount(() => {
      Array.from(
        section?.parentElement?.querySelectorAll('section') || []
      ).some((_section, index) => section === _section && setNumber(index + 1))
    })
  }

  return (
    <section id={`${props.id}-section`} ref={section}>
      <Details
        id={props.id}
        summary={
          <Title level={level}>
            <Show when={props.numerate} fallback={props.title}>
              <div class="flex items-center space-x-3">
                <div
                  style="font-size: 0.7em"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white"
                >
                  <span>{number()}</span>
                </div>
                <span>{props.title}</span>
              </div>
            </Show>
          </Title>
        }
        class="space-y-6"
      >
        <Show when={props.description}>
          <Paragraph level={level}>{props.description}</Paragraph>
        </Show>
        {props.children}
      </Details>
    </section>
  )
}
