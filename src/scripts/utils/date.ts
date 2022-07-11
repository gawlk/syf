export const getOrdinalDay = (day: number) => {
  const rest = (day % 30) % 20

  return `${day}${
    rest === 1 ? 'st' : rest === 2 ? 'nd' : rest === 3 ? 'rd' : 'th'
  }`
}
