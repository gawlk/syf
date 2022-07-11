import {
  clampChroma,
  formatRgb,
  modeOklch,
  modeP3,
  modeRgb,
  useMode,
  // @ts-ignore
} from 'culori/fn'

import { round } from '/src/scripts'

import cryptoColors from '/src/assets/colors/crypto.json'

const rgb = useMode(modeRgb)
const oklch = useMode(modeOklch)
const p3 = useMode(modeP3)

export const colors = {
  rbg: {
    gray: {
      r: 128,
      g: 128,
      b: 128,
    },
    green: {
      r: 80,
      g: 180,
      b: 90,
    },
    red: {
      r: 220,
      g: 90,
      b: 100,
    },
  },
}

const stringToRGB = (str: string): RGB => {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const rgb = []

  for (let i = 0; i < 3; i++) {
    rgb.push((hash >> (i * 8)) & 0xff)
  }

  return {
    r: rgb[0],
    g: rgb[1],
    b: rgb[2],
  }
}

// TODO: Ditch function when OKLCH and color conversion is available on all browsers
export const convertRGBToBackgroundColorProperty = (rgbColor: RGB) => {
  const { r, g, b } = rgbColor

  const formattedRGB = `rgb(${r}, ${g}, ${b})`

  const color = oklch(rgb(formattedRGB))

  color.l = 0.9

  function formatOklch(color: any): string {
    let { l, c, h, alpha } = color

    let postfix = ''

    const toPercent = (value: number): string => {
      return `${round(100 * value)}%`
    }

    if (typeof alpha !== 'undefined' && alpha < 1) {
      postfix = ` / ${toPercent(alpha)}`
    }

    return `oklch(${toPercent(l)} ${round(c, 3)} ${round(h || 0, 1)}${postfix})`
  }

  const convertOklchToCSSProperty = (color: any, property: string) => {
    let css = ''

    const cssOKLCH = formatOklch(color)
    const cssRGB = formatRgb(rgb(clampChroma(color, 'oklch')))

    css = `${property}: ${cssRGB};`

    const inP3 = (color: any): boolean => {
      let { r, b, g } = p3(color)
      return r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1
    }

    if (inP3(color)) {
      css += ` ${property}: ${cssOKLCH};`
    }

    return css
  }

  return convertOklchToCSSProperty(color, 'background-color')
}

export const convertIDToBackgroundColorProperty = (id?: string) =>
  id
    ? convertRGBToBackgroundColorProperty(
        (cryptoColors as any)[id] || stringToRGB(id)
      )
    : ''
