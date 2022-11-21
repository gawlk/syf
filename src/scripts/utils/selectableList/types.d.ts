interface SelectableList<S, L = S> {
  selected: S | null
  readonly list: L[]
}
