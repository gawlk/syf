export const round = (value: number, digits: number = 0): number => {
  return (
    Math.round(parseFloat((value * 10 ** digits).toFixed(digits))) /
    10 ** digits
  )
}
