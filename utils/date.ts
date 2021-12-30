export function GetRemainDays(currentTime, endTime) {
  const remainTime = endTime - currentTime

  const day = Math.floor(remainTime / (86400 * 1000))
  const dayTime = remainTime - (day * 86400 *1000)

  const hour = Math.floor(dayTime / (3600 * 1000))
  const minute = Math.floor((dayTime - hour * 3600 * 1000) / (60 * 1000))

  return {
    day,
    hour,
    minute
  }
}
