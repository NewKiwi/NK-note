export default function(target) {
  // 第一个值不进行遍历
  for (let i = 1, len = arguments.length; i < len; i++) {
    // 源对象, 避免出现undefined和null值（如果是数组、数字、字符串或者布尔值呢？）
    // 我原以为数字、字符串或者布尔值会转化为原生对象，无可遍历属性，'use stirct'中undefined和null进行for...in循环会报错，非严格模式会静默失败，可是都是返回undefined
    const source = arguments[i] || {}
    for (const prop in source) {
      if (source.hasOwnProperty(prop)) {
        const value = source[prop]
        // 不要undefined
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }
  return target
}
