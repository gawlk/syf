import Button from '/src/components/button'
import ButtonDivider from '/src/components/buttonDivider'
import Dialog from '/src/components/dialog'
import DialogSearchInput from '/src/components/dialogSearchInput'
import Label from '/src/components/label'
import Link from '/src/components/link'
import TextFromAsset from '/src/components/textFromAsset'

import { createAPI } from '/src/scripts'

interface Props {
  defaults: ObjectByAssetKind<Asset[]>
  categories: Category[]
  select: (asset: Asset) => void
}

export default (props: Props) => {
  const api = createAPI()

  const [state, setState] = createStore({
    results: null as Asset[] | null,
  })

  const isAssetInSelected = (asset: Asset) =>
    !!props.categories
      .map((category) => category.assets)
      .flat()
      .find(
        (_asset) =>
          asset.kind === _asset.kind &&
          (asset.id ? asset.id === _asset.id : asset.symbol === _asset.symbol)
      )

  return (
    <Dialog
      id="assets"
      title="Assets"
      button={{
        leftIcon: IconTablerListSearch,
        text: 'Add an asset',
        full: true,
      }}
      sticky={
        <DialogSearchInput
          placeholder="Asset"
          onInput={async (query) => {
            if (query) {
              const assets = await api.searchAssets(query)

              setState(
                'results',
                assets.map((asset) => {
                  if (asset.source === 'yahoo') {
                    const defaultAsset = props.defaults[asset.kind].find(
                      (defaultAsset) => defaultAsset.symbol === asset.symbol
                    )

                    if (defaultAsset) {
                      return defaultAsset
                    }
                  }

                  return asset
                })
              )
            } else {
              setState('results', null)
            }
          }}
        />
      }
    >
      <Show
        when={!state.results}
        fallback={() => (
          <Show when={state.results?.length} fallback={<div>No results</div>}>
            <div class="space-y-2">
              <For each={state.results}>
                {(asset) => (
                  <Asset
                    asset={asset}
                    disabled={isAssetInSelected(asset)}
                    showKind={true}
                    select={props.select}
                  />
                )}
              </For>
            </div>
          </Show>
        )}
      >
        <div class="space-y-6">
          <For each={props.categories}>
            {(category) => {
              const list = createMemo(() => props.defaults[category.kind])

              const defaultNumberOfVisibleAssets = 3

              const [state, setState] = createStore({
                numberOfVisibleAssets: defaultNumberOfVisibleAssets,
              })

              const increase = 10

              return (
                <Label label={category.name}>
                  <For
                    each={list().slice(0, state.numberOfVisibleAssets) || []}
                  >
                    {(asset) => (
                      <Asset
                        asset={asset}
                        disabled={isAssetInSelected(asset)}
                        select={props.select}
                      />
                    )}
                  </For>
                  <Show when={list().length > state.numberOfVisibleAssets}>
                    <Button
                      full
                      leftIcon={IconTablerPlaylistAdd}
                      onClick={(event) => {
                        event.preventDefault()

                        setState('numberOfVisibleAssets', (n) => n + increase)
                      }}
                    >
                      Show{' '}
                      {Math.min(
                        list().length - state.numberOfVisibleAssets,
                        increase
                      )}{' '}
                      more
                    </Button>
                  </Show>
                </Label>
              )
            }}
          </For>
        </div>
      </Show>
    </Dialog>
  )
}

const Asset = (props: {
  asset: Asset
  disabled: boolean
  showKind?: boolean
  select: (asset: Asset) => void
}) => {
  return (
    <div class="flex">
      <Button
        value={props.asset.id}
        leftIcon={props.asset.icon}
        rightIcon={IconTablerPlus}
        disabled={props.disabled}
        full
        transparent
        rgb={props.asset.rgb}
        class="rounded-r-none"
        onClick={() => props.select(props.asset)}
      >
        <TextFromAsset asset={props.asset} showKind={props.showKind} />
      </Button>
      <ButtonDivider rgb={props.asset.rgb} />
      <Link
        href={props.asset.url}
        transparent
        class="rounded-l-none"
        rgb={props.asset.rgb}
      />
    </div>
  )
}
