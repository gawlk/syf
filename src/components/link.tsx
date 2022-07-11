import Interactive, { type InteractiveProps } from './interactive'

interface Props extends SolidAppRouter.LinkProps, InteractiveProps {}

export default (props: Props) => {
  const translateClasses = 'group-hover:translate-x-1 will-change-transform'

  props = mergeProps(
    props,
    props.svg || props.src
      ? {
          illustrationClass: [props.illustrationClass, translateClasses].join(
            ' '
          ),
        }
      : {
          rightSvg: IconTablerArrowRight,
          rightIllustrationClass: translateClasses,
        }
  )

  return (
    <Interactive component={Link} clickable {...props}>
      {props.children}
    </Interactive>
  )
}
