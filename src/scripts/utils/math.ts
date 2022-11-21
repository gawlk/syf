export const round = (value: number, digits: number = 0): number => {
  return (
    Math.round(parseFloat((value * 10 ** digits).toFixed(digits))) /
    10 ** digits
  )
}

export const average = (values: number[]) =>
  values.reduce((p, c) => (c += p)) / values.length
