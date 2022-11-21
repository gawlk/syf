import { addLocationToID, createAPI, moveIndexAndCopyArray } from '/src/scripts'

import Dialog from './components/dialog'
import SortableItem from './components/sortableItem'
import SortableList from './components/sortableList'

import Label from '/src/components/label'
import Section, { type Props as SectionProps } from '/src/components/section'
import TextFromAsset from '/src/components/textFromAsset'

interface Props {
  categories: Category[]
  setter: (kind: AssetKind, assets: Asset[]) => void
}

export default (props: Props) => {
  const sectionProps: SectionProps = {
    id: 'assets',
    title: 'Assets',
    description: `Select your assets here`,
    numerate: true,
  }

  const id = addLocationToID(sectionProps.id)

  const api = createAPI()

  const [state, setState] = createStore({
    defaults: {
      crypto: [],
      equity: [],
      etf: [],
    } as ObjectByAssetKind<Asset[]>,
  })

  const save = () => {
    props.categories.map((category) => {
      localStorage.setItem(
        `${id}-${category.kind}`,
        JSON.stringify(category.assets.map((asset) => asset.id || asset.symbol))
      )
    })
  }

  onMount(async () => {
    const defaults = await api.fetchSearchDefaults()

    setState('defaults', defaults)

    const saved: ObjectByAssetKind<Asset[]> = {
      crypto: [],
      equity: [],
      etf: [],
    }

    await Promise.all(
      Object.entries(defaults).map(
        // @ts-ignore next-line
        async ([kind, list]: [AssetKind, Asset[]]) => {
          const raw = localStorage.getItem(`${id}-${kind}`)

          const savedIDs = raw && JSON.parse(raw)

          if (savedIDs && Array.isArray(savedIDs)) {
            await Promise.all(
              savedIDs.map(async (id) => {
                let asset = list.find((asset) =>
                  kind === 'crypto' ? asset.id === id : asset.symbol === id
                )

                if (!asset) {
                  const results = await api.searchAssets(id, {
                    coinGecko: kind === 'crypto',
                    yahoo: kind !== 'crypto',
                  })

                  if (results?.length) {
                    asset = results[0]
                  }
                }

                if (asset) {
                  saved[kind].push(asset)
                }
              })
            )
          }
        }
      )
    )

    Object.keys(saved).map((category) => {
      props.setter(category as AssetKind, saved[category as AssetKind])
    })
  })

  return (
    <Section {...sectionProps}>
      <div class="space-y-6">
        <For each={props.categories}>
          {(category) => {
            return (
              <Show when={category.assets.length}>
                <Label label={category.name}>
                  <SortableList
                    onDragEnd={(oldIndex: number, newIndex: number) => {
                      props.setter(
                        category.kind,
                        moveIndexAndCopyArray(
                          category.assets,
                          oldIndex,
                          newIndex
                        )
                      )

                      save()
                    }}
                    class="space-y-2"
                  >
                    <For each={category.assets}>
                      {(asset) => (
                        <SortableItem
                          asset={asset}
                          onRemove={() => {
                            props.setter(
                              category.kind,
                              category.assets.filter((_asset) =>
                                asset.id
                                  ? asset.id !== _asset.id
                                  : asset.symbol !== _asset.symbol
                              )
                            )

                            save()
                          }}
                        >
                          <TextFromAsset asset={asset} />
                        </SortableItem>
                      )}
                    </For>
                  </SortableList>
                </Label>
              </Show>
            )
          }}
        </For>
      </div>
      <Dialog
        defaults={state.defaults}
        categories={props.categories}
        select={(asset: Asset) => {
          const category = props.categories.find(
            (category) => category.kind === asset.kind
          )

          if (category) {
            props.setter(asset.kind, [...category.assets, asset])

            save()
          }
        }}
      />
    </Section>
  )
}
