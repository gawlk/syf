import { createCoinGeckoAPI } from '/src/scripts'

import Input from '/src/components/input'
import Section from '/src/components/section'
import Select from '/src/components/select'

export default () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [state, setState] = createStore({
    initial: Number(searchParams.initial) || 100,
    recurrent: Number(searchParams.recurrent) || 5,
    currency: searchParams.currency || 'usd',
  })

  const api = createCoinGeckoAPI()

  return (
    <Section title="Amount" description={`Select an amount here`}>
      <Input
        id="initial-amount"
        pre="Initial"
        leftSvg={IconTablerCashBanknote}
        value={state.initial}
        min={0}
        onInput={(event) => {
          const value = (event.target as HTMLInputElement).value
          setState('initial', Number(value))
          setSearchParams({
            initial: value,
          })
        }}
      />
      <Input
        id="recurrent-amount"
        pre="Recurrent"
        leftSvg={IconTablerRepeat}
        value={state.recurrent}
        min={0}
        onInput={(event) => {
          const value = (event.target as HTMLInputElement).value
          setState('recurrent', Number(value))
          setSearchParams({
            recurrent: value,
          })
        }}
      />
      <Select
        pre="Currency"
        leftSvg={IconTablerCurrency}
        selected={state.currency}
        onChange={(event) => {
          const value = (event.target as HTMLSelectElement).value
          setState('currency', value)
          setSearchParams({
            currency: value,
          })
        }}
        values={api.supportedFiatCurrencies.map((fiat) =>
          fiat.symbol.toLowerCase()
        )}
        labels={api.supportedFiatCurrencies.map(
          (fiat) => `${fiat.symbol} - ${fiat.name}`
        )}
      />
    </Section>
  )
}
