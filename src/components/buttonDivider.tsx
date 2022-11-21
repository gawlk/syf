import { convertRGBToCSSRGB } from '/src/scripts'

interface Props {
  rgb?: RGB
}

export default (props: Props) => {
  return (
    <div
      class="w-[3px] flex-none bg-stone-400/75"
      style={
        props.rgb
          ? {
              'background-color': convertRGBToCSSRGB(props.rgb, {
                l: 0.75,
                c: (c) => c / 2,
              }),
            }
          : {}
      }
    />
  )
}
