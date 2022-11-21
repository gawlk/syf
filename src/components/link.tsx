import Interactive, { type InteractiveProps } from './interactive'

interface Props extends SolidAppRouter.LinkProps, InteractiveProps {}

export default (props: Props) => {
  const external = props.href.startsWith('http')

  const translateClasses = `will-change-transform ${
    external
      ? 'group-hover:translate-x-1 group-hover:-translate-y-0.5'
      : 'group-hover:translate-x-0.5'
  }`

  const arrowRight = IconTablerArrowRight
  const arrowUpRight = IconTablerArrowUpRight
  const icon = external ? arrowUpRight : arrowRight

  props = mergeProps(
    props,
    external && {
      target: '_blank',
    },
    !props.children &&
      !props.icon &&
      ({
        icon,
      } as Props),
    !props.children || props.icon
      ? ({
          iconClass: [props.iconClass, translateClasses].join(' '),
        } as Props)
      : ({
          rightIcon: icon,
          rightIconClass: translateClasses,
        } as Props)
  )

  return (
    <Interactive
      component={props.disabled ? 'span' : Link}
      clickable
      {...props}
    >
      {props.children}
    </Interactive>
  )
}
