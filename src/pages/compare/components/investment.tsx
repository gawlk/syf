import { currencies } from '/src/scripts'

import DialogSelect from '/src/components/dialogSelect'
import Input from '/src/components/input'
import Section, { type Props as SectionProps } from '/src/components/section'
import TextFromCurrency from '/src/components/textFromCurrency'

interface Props {
  investment: Investment
  setter: (key: keyof Investment, value?: string) => void
}

export default (props: Props) => {
  const sectionProps: SectionProps = {
    id: 'investment',
    title: 'Investment',
    description: `Select an amount here`,
    numerate: true,
  }

  return (
    <Section {...sectionProps}>
      <div class="space-y-2">
        <DialogSelect
          id={`${sectionProps.id}-currency`}
          button={{
            leftIcon: props.investment.currency.icon,
            pre: 'Currency',
            text: <TextFromCurrency currency={props.investment.currency} />,
          }}
          title="Select a currency"
          search={{
            placeholder: 'Currency',
          }}
          list={{
            selected: props.investment.currency.symbol,
            values: currencies.map((currency) => currency.symbol),
            labels: currencies.map((currency) => (
              <TextFromCurrency currency={currency} />
            )),
            icons: currencies.map((currency) => currency.icon),
          }}
          onClose={(value?: string) => {
            props.setter('currency', value)
          }}
        />
        <For
          each={[
            {
              pre: 'Initial',
              svg: IconTablerWallet,
            },
            {
              pre: 'Recurrent',
              svg: IconTablerRepeat,
            },
          ]}
        >
          {(obj) => {
            const key = obj.pre.toLowerCase() as 'initial' | 'recurrent'

            const id = `${sectionProps.id}-${key}`

            return (
              <Input
                id={id}
                leftIcon={obj.svg}
                rightIcon={props.investment.currency.icon}
                pre={obj.pre}
                value={props.investment[key]}
                min={0}
                onInput={(value) => props.setter(key, value)}
              />
            )
          }}
        </For>
      </div>
    </Section>
  )
}
