export const removeObjectsWithSameKeyFromArray = <T>(
  arr: T[],
  key: keyof T
) => {
  const keys = [] as any[]

  return arr.filter((obj) => {
    const value = obj[key]

    const alreadyProcessed = keys.includes(value)

    keys.push(obj[key])

    return !alreadyProcessed
  })
}
