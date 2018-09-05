export function noop() {}

export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

// 二维且项为对象的数组？
export function toObject(arr) {
  var res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export const generateId = function() {
  return Math.floor(Math.random() * 10000)
}

export const getValueByPath = function(object, prop) {
  prop = prop || ''
  const paths = prop.split('.')
  let current = object
  let result = null
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i]
    if (!current) break

    if (i === j - 1) {
      result = current[path]
      break
    }
    current = current[path]
  }
  return result
}

// instanceof在不同窗口的判断是不同的? iframe的情况？
export const valueEquals = (a, b) => {
  // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true
  if (!(a instanceof Array)) return false
  if (!(b instanceof Array)) return false
  if (a.length !== b.length) return false
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}
