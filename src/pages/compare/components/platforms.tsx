import Button from '/src/components/button'
import Input from '/src/components/input'
import Label from '/src/components/label'
import Section, { type Props as SectionProps } from '/src/components/section'

interface Props {
  currency: Currency
  categories: Category[]
  setter: (category: Category, key: keyof Fees, value: number) => void
}

export default (props: Props) => {
  const sectionProps: SectionProps = {
    id: 'platforms',
    title: 'Platforms',
    description: `Enter platforms here`,
    numerate: true,
  }

  const [state, setState] = createStore({
    platforms: [],
  })

  return (
    <Section {...sectionProps}>
      <div class="space-y-6">
        <For each={props.categories}>
          {(category) => (
            <Show when={category.assets.length}>
              <Label label={category.name}>
                {() =>
                  [
                    {
                      pre: 'Flat',
                      leftSvg: IconTablerReceipt2,
                      rightIcon: props.currency.icon,
                    },
                    {
                      pre: 'Percentage',
                      leftSvg: IconTablerReceiptTax,
                      rightIcon: IconTablerPercentage,
                      max: 100,
                    },
                  ].map((obj) => {
                    const key = obj.pre.toLowerCase() as keyof Fees

                    const id = `${sectionProps.id}-${category.name}-${key}`

                    return (
                      <Input
                        id={id}
                        leftIcon={obj.leftSvg}
                        rightIcon={obj.rightIcon}
                        pre={obj.pre}
                        value={category.fees[key]}
                        min={0}
                        max={obj.max}
                        step={0.01}
                        onInput={(value) =>
                          props.setter(category, key, Number(value))
                        }
                      />
                    )
                  })
                }
              </Label>
            </Show>
          )}
        </For>
        <Button
          full
          leftIcon={IconTablerBuildingBank}
          rightIcon={IconTablerPlus}
          onClick={() => setState('platforms', (platforms) => [platforms, {
            name: `Platform ${platforms.length + 1}`,
            fees: 
          }])}
        >
          <span class="flex-1 text-left">Add a platform</span>
        </Button>
      </div>
    </Section>
  )
}
