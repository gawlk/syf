import Input from '/src/components/input'
import Section from '/src/components/section'

export default () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [state, setState] = createStore({
    flat: Number(searchParams.flat) || 0,
    percentage: Number(searchParams.percentage) || 0.5,
  })

  return (
    <Section title="Fees" description={`Select fees here`}>
      <Input
        id="flat-fees"
        pre="Flat"
        leftSvg={IconTablerCoin}
        value={state.flat}
        min={0}
        step={0.01}
        onInput={(event) => {
          const value = (event.target as HTMLInputElement).value
          setState('flat', Number(value))
          setSearchParams({
            flat: value,
          })
        }}
      />
      <Input
        id="percentage-fees"
        pre="Percentage"
        leftSvg={IconTablerPercentage}
        value={state.percentage}
        min={0}
        step={0.01}
        onInput={(event) => {
          const value = (event.target as HTMLInputElement).value
          setState('percentage', Number(value))
          setSearchParams({
            percentage: value,
          })
        }}
      />
    </Section>
  )
}
