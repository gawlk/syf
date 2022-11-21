import { colors } from '/src/scripts'

export const applyColorOnArea = (
  area: LightweightCharts.ISeriesApi<'Area'>,
  options: {
    prices?: number[]
    rgb?: RGB
  }
) => {
  if (options.prices) {
    const from = options.prices.at(0) || 0
    const to = options.prices.at(-1) || 0

    options.rgb =
      to > from
        ? colors.rbg.green
        : to === from
        ? colors.rbg.gray
        : colors.rbg.red
  } else if (!options.rgb) {
    options.rgb = colors.rbg.gray
  }

  const { r, g, b } = options.rgb

  area.applyOptions({
    lineColor: `rgba(${r}, ${g}, ${b}, 1)`,
    topColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
    bottomColor: `rgba(${r}, ${g}, ${b}, 0)`,
  })
}
