export const styleToCSSProperties = (
  style?: string | SolidJS.JSXCSSProperties
) => {
  if (!style) {
    return {}
  } else if (typeof style === 'object') {
    return style
  }
  const styleObject: SolidJS.JSXCSSProperties = {}

  ;(style || '').replace(/([\w-]+)\s*:\s*([^;]+)/g, (_, prop, value) => {
    styleObject[prop] = value
    return ''
  })

  return styleObject
}
