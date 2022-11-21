import {
  clampChroma,
  formatRgb,
  modeOklch,
  modeP3,
  modeRgb,
  useMode, // @ts-ignore next-line
} from 'culori/fn'

const rgb = useMode(modeRgb)
const oklch = useMode(modeOklch)

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

export const stringToRGB = (str: string): RGB => {
  const stringToHash = (s: string) => {
    for (var i = 0, h = 9; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9)
    }

    return h ^ (h >>> 9)
  }

  const hash = stringToHash(str)

  return {
    r: (hash & 0x00ff0000) >> 16,
    g: (hash & 0x0000ff00) >> 8,
    b: hash & 0x000000ff,
  }
}

type Modifier = number | ((v: number) => number)

export const convertRGBToCSSRGB = (
  rgbColor: RGB,
  options?: {
    l?: Modifier
    c?: Modifier
    h?: Modifier
    a?: string
  }
) => {
  const { r, g, b } = rgbColor

  const formattedRGB = `rgb(${r}, ${g}, ${b})`

  const color = oklch(rgb(formattedRGB))

  const applyModifier = (key: string, modifier?: Modifier) => {
    if (modifier) {
      color[key] =
        typeof modifier === 'number' ? modifier : modifier(color[key])
    }
  }

  if (options) {
    applyModifier('l', options.l)
    applyModifier('c', options.c)
    applyModifier('h', options.h)
  }

  const cssRGB = formatRgb(rgb(clampChroma(color, 'oklch')))

  return options?.a ? `${cssRGB.slice(0, -1)} ${options.a})` : cssRGB
}

export const convertRGBToBackgroundCSSRGB = (rgb: RGB) =>
  convertRGBToCSSRGB(rgb, { l: 0.9 })

export const convertRGBToIconCSSRGB = (rgb: RGB) =>
  convertRGBToCSSRGB(rgb, { l: 0.65, c: (c) => c / 2 })

export const convertRGBToOffTextCSSRGB = (rgb: RGB) =>
  convertRGBToCSSRGB(rgb, { l: 0.5, c: (c) => c / 2 })
