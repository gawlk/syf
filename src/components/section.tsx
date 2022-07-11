import Title from './title'
import Paragraph from './paragraph'

interface Props extends SolidJS.ParentProps {
  title: string | SolidJS.JSXElement
  description: string | SolidJS.JSXElement
}

export default (props: Props) => {
  const level = 4

  const [number, setNumber] = createSignal(0)

  let section: HTMLElement | undefined

  onMount(() => {
    Array.from(section?.parentElement?.querySelectorAll('section') || []).some(
      (_section, index) => section === _section && setNumber(index + 1)
    )
  })

  return (
    <section ref={section} class="space-y-6">
      <Title level={level} margin>
        <div class="flex items-center space-x-3">
          <div
            style="font-size: 0.7em"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white"
          >
            <span>{number()}</span>
          </div>
          <span>{props.title}</span>
        </div>
      </Title>
      <Paragraph level={level}>{props.description}</Paragraph>
      {props.children}
    </section>
  )
}
