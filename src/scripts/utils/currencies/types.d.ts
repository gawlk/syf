interface Currency {
  symbol: string
  name: string
  icon?: (...args: any[]) => SolidJS.JSXElement
}
