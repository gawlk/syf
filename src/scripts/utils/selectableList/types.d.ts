interface SelectableList<S, L = S> {
  selected: S | null
  readonly list: L[]
}

interface SelectableOptionalList<S, L = S> {
  selected: S | null
  readonly list?: L[]
}
