// 暂时只作文本末尾省略号功能，开头、结尾添加其他内容，用修饰符拓展即可
function ellipsis(str, maxLength, { position = 'end', replace = '...' } = {}) {
  if (!str) return false
  const length = str.length
  const replaceLength = replace.length
  if (maxLength > length) return str
  if (position === 'start') {
    return `${replace}${str.slice(-(maxLength - replaceLength))}`
  } else if (position === 'end') {
    return `${str.slice(0, maxLength - replaceLength)}${replace}`
  } else {
    return str
  }
}

export default {
  bind(el, binding) {
    let text = el.innerText
    const max = binding.value
    // 假如是异步获取的数据再渲染, innerText获取的是空的值，所以无效
    if (max && text) {
      if (binding.modifiers.nowrap) {
        const reg = /(\r\n)|(\n)/g
        text = text.replace(reg, '')
      }
      el.innerText = ellipsis(text, max)
    }
  },
  componentUpdated(el, binding) {
    let text = el.innerText
    const max = binding.value
    if (max && text) {
      if (binding.modifiers.nowrap) {
        const reg = /(\r\n)|(\n)/g
        text = text.replace(reg, '')
      }
      el.innerText = ellipsis(text, max)
    }
  }
}
