export const moveIndexAndCopyArray = <T>(
  originalArray: T[],
  oldIndex: number,
  newIndex: number
) => {
  let copiedArray = [...originalArray]

  const [movedElement] = copiedArray.splice(oldIndex, 1)

  copiedArray = [
    ...copiedArray.slice(0, newIndex),
    movedElement,
    ...copiedArray.slice(newIndex),
  ]

  return copiedArray
}
