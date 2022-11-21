export const filterPropsKeys = <T extends Object>(
  props: T,
  propsKeys: BooleanObject,
  filter: 'include' | 'exclude' = 'include'
) =>
  Object.keys(props).filter((key) =>
    filter === 'include' ? propsKeys[key] : !propsKeys[key]
  ) as (keyof T)[]

export const keepProps = <T extends Object>(
  props: T,
  propsKeys: BooleanObject
) => splitProps(props, filterPropsKeys<T>(props, propsKeys))[0]

export const removeProps = <T extends Object>(
  props: T,
  propsKeys: BooleanObject
) => splitProps(props, filterPropsKeys<T>(props, propsKeys, 'exclude'))[0]
