export function initParams (val) {
  let newVal = val
  if (!val || val === null || val === 'null' || val === undefined || val === 'undefined') {
    newVal = ''
  }
  return newVal
}
