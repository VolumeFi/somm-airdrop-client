export function shorten(val, len = 18) {
  const prior = Math.floor(len * 0.7)
  const suffix = len - prior
  return `${val.substr(0, prior)}...${val.substr(-suffix)}`
}

export function prevZero(val, fill = '0', len = 3) {
  return val.toString().padStart(len, fill)
}
