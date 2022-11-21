import Section, { type Props as SectionProps } from '/src/components/section'

import Input from './components/input'

interface Props {
  categories: Category[]
  setter: (object: Category | Asset, repartition: number) => void
}

export default (props: Props) => {
  const sectionProps: SectionProps = {
    id: 'repartition',
    title: 'Repartition',
    description: `Choose your repartition here`,
    numerate: true,
  }

  return (
    <Section {...sectionProps}>
      <div class="space-y-6">
        <For
          each={props.categories.filter((category) => category.assets.length)}
        >
          {(category) => {
            const id = `${sectionProps.id}-${category.name}`

            return (
              <div>
                <Input
                  otherValues={props.categories
                    .filter(
                      (_category) =>
                        category !== _category && _category.assets.length
                    )
                    .map((category) => category.repartition)}
                  id={id}
                  pre={category.name}
                  leftIcon={IconTablerChartDonut3}
                  leftIconStyle={`transform: rotate(${Math.round(
                    Math.random() * 360
                  )}deg)`}
                  value={category.repartition}
                  rightIcon={IconTablerPercentage}
                  onInput={(value) => props.setter(category, Number(value))}
                  class="rounded-b-none"
                />
                <div class="space-y-2 rounded-xl rounded-t-none border-[3px] border-t-0 border-black border-opacity-5 p-2">
                  <For each={category.assets}>
                    {(asset) => (
                      <Input
                        id={`${id}-${asset.id || asset.symbol}`}
                        otherValues={category.assets
                          .filter((_asset) => _asset !== asset)
                          .map((_asset) => _asset.repartition)}
                        rgb={asset.rgb}
                        leftIcon={asset.icon}
                        pre={asset.symbol}
                        value={asset.repartition}
                        rightIcon={IconTablerPercentage}
                        onInput={(value) => props.setter(asset, Number(value))}
                        class="rounded-lg"
                      />
                    )}
                  </For>
                </div>
              </div>
            )
          }}
        </For>
      </div>
    </Section>
  )
}
