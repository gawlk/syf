import Card from '/src/components/card'
import TitledMarkdown from '/src/components/titledMarkdown'

import introduction from './markdown.md?raw'

export default () => {
  return (
    <Card>
      <TitledMarkdown
        title={
          <>
            <span class="text-stone-400">...because</span> you should win
            <span class="text-stone-400"> too...</span>
          </>
        }
        level={2}
        markdown={introduction}
        centered
      />
    </Card>
  )
}
