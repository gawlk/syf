import snarkdown from 'snarkdown'

import Paragraph from './paragraph'
import Title, { Props as PropsTitle } from './title'

export interface Props extends PropsTitle {
  title: string | SolidJS.JSXElement
  markdown: string
  centered?: boolean
}

export default (props: Props) => {
  return (
    <div
      class={[
        Number(props.level) === 1
          ? 'mx-6 space-y-16'
          : Number(props.level) === 2
          ? 'space-y-12 px-4'
          : Number(props.level) === 3
          ? 'space-y-8 px-3'
          : Number(props.level) === 4
          ? 'space-y-4 px-2'
          : Number(props.level) === 5
          ? 'space-y-2 px-1'
          : 'space-y-1 px-0.5',
        props.centered ? 'md:text-center' : '',
      ].join(' ')}
    >
      <Title {...props}>{props.title}</Title>
      <Paragraph
        {...props}
        html={snarkdown(props.markdown)
          .replaceAll('<a ', '<a target="_blank" rel="noopener noreferrer" ')
          .replaceAll('<br />', '<br><br>')
          .replaceAll('><br><br>', '><br>')}
      />
    </div>
  )
}
