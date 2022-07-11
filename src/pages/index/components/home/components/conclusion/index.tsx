import Card from '/src/components/card'
import TitledMarkdown from '/src/components/titledMarkdown'

import conclusion from './markdown.md?raw'

export default () => {
  return (
    <Card>
      <TitledMarkdown
        title={
          <>
            <span class="text-stone-400">...but</span> patience is key.
          </>
        }
        level={2}
        markdown={conclusion}
        centered
      />
    </Card>
  )
}
