
export const formatDate = (date: string | Date): string => {
  const d = new Date(date)

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
}

export const compareDates = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString()
}

export const isBeforeOrEqual = (date1: Date, date2: Date): boolean => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
  return d1 <= d2
}

export const isAfterOrEqual = (date1: Date, date2: Date): boolean => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
  return d1 >= d2
}