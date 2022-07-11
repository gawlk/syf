import {
  convertIDToBackgroundColorProperty,
  moveIndexAndCopyArray,
} from '/src/scripts'

import Button from '/src/components/button'
import DialogSearch from '/src/components/dialogSearch'
import Link from '/src/components/link'
import Section from '/src/components/section'

import AssetToText from './assetToText'
import ButtonDivider from './buttonDivider'
import SortableItem from './sortableItem'
import SortableList from './sortableList'

export default () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [state, setState] = createStore({
    strategies: [],
    search: {
      name: '',
      defaultResults: null as CoinGeckoSearchData | null,
      results: null as CoinGeckoSearchData | null,
    },
  })

  const searchStrategies = async (value: string) => {
    // setState('search', {
    //   results: value
    //     ? await api.searchData(value)
    //     : state.search.defaultResults,
    // })
  }

  onMount(async () => {
    // setState(
    //   'assets',
    //   await Promise.all(
    //     (searchParams.assets || '')
    //       .split(',')
    //       .filter((id) => id)
    //       .map(async (id) => {
    //         return {
    //           data: await api.fetchAssetData({
    //             id,
    //           }),
    //           marketChart: await api.fetchAssetMarketChart({
    //             id,
    //           }),
    //         }
    //       })
    //   )
    // )
    // const defaultResults = await api.searchData('')
    // defaultResults.coins.splice(100)
    // setState('search', {
    //   defaultResults,
    // })
    // setState('search', {
    //   results: defaultResults,
    // })
  })

  return (
    <Section title="Strategies" description={`Select strategies here`}>
      <SortableList
        onDragEnd={(oldIndex: number, newIndex: number) => {
          setState(
            'strategies',
            moveIndexAndCopyArray(state.strategies, oldIndex, newIndex)
          )
        }}
        class="space-y-2"
      >
        <For each={state.strategies}>
          {(asset) => (
            <div></div>
            // <SortableItem
            //   id={asset.data.id}
            //   icon={asset.data.image.large}
            //   onRemove={() => {
            //     // setState('assets', (assets) =>
            //     //   assets.filter((_asset) => asset.data.id !== _asset.data.id)
            //     // )
            //     // setSearchParams({
            //     //   assets: state.assets.map((asset) => asset.data.id).join(','),
            //     // })
            //   }}
            // >
            //   <AssetToText data={asset.data} />
            // </SortableItem>
          )}
        </For>
        <DialogSearch
          title="Strategies"
          button={{
            text: 'Add a strategy',
          }}
          pre="Name"
          placeholder="Strategy"
          value={state.search.name}
          onInput={(value: string) => {
            // searchAssets(value)
          }}
          onClose={async (id?: string) => {
            // if (id) {
            //   const asset = {
            //     data: await api.fetchAssetData({
            //       id,
            //     }),
            //     marketChart: await api.fetchAssetMarketChart({
            //       id,
            //     }),
            //   }
            //   setState('assets', (assets) => [...assets, asset])
            //   setSearchParams({
            //     assets: state.assets.map((asset) => asset.data.id).join(','),
            //   })
            // }
          }}
        >
          <div class="space-y-2">
            <For each={[]}>
              {(result) => {
                // const backgroundColor = convertIDToBackgroundColorProperty(
                //   result.id
                // )

                return (
                  <div class="flex">
                    {/* <Button
                      value={result.id}
                      leftSrc={result.large}
                      rightSvg={IconTablerPlus}
                      full
                      transparent
                      class="rounded-r-none hover:brightness-90"
                      style={backgroundColor}
                    >
                      <AssetToText data={result} />
                    </Button>
                    <ButtonDivider backgroundColor={backgroundColor} />
                    <Link
                      href={`/assets/crypto/${result.id}`}
                      svg={IconTablerArrowRight}
                      transparent
                      class="rounded-l-none hover:brightness-90"
                      style={backgroundColor}
                    /> */}
                  </div>
                )
              }}
            </For>
          </div>
        </DialogSearch>
      </SortableList>
    </Section>
  )
}
