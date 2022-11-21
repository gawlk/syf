export const unixDateLength = String(new Date().valueOf()).length

export const getOrdinalDay = (day: number) => {
  const rest = (day % 30) % 20

  return `${day}${
    rest === 1 ? 'st' : rest === 2 ? 'nd' : rest === 3 ? 'rd' : 'th'
  }`
}

export const getWeekDay = (date: Date) =>
  date.toLocaleString('en', {
    weekday: 'long',
  })

export const getMonth = (index: number) =>
  new Date(0, index + 1, 0).toLocaleString('en', {
    month: 'long',
  })

export const getWeekDays = () =>
  [...Array(7).keys()].map((index) => getWeekDay(new Date(0, 0, index + 1)))

export const getMonths = () =>
  [...Array(12).keys()].map((index) => getMonth(index))
