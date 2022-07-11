import Amount from './components/amount'
import Assets from './components/assets'
import Fees from './components/fees'
import Frequency from './components/frequency'
import Interval from './components/interval'
import Strategies from './components/strategies'

export default () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [state, setState] = createStore({
    assets: searchParams.assets?.split(',') || [],
  })

  return (
    <div class="min-h-screen md:flex">
      <div class="w-full min-w-0 flex-1 space-y-12 p-6">
        <Frequency />
        <Amount />
        <Fees />
        <Interval />
        <Assets />
        <Strategies />
      </div>
      <div class="hidden w-full min-w-0 flex-1 space-y-8 p-6 md:block">
        charts
      </div>
    </div>
  )
}
