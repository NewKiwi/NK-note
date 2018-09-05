// 模拟目标文本框的变量
let hiddenTextarea

const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`

// 目标文本框的样式
const CONTEXT_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing'
]

// 计算CONTEXT_STYLE中对应目标元素的所有样式
function calculateNodeStyling(targetElement) {
  const style = window.getComputedStyle(targetElement)

  const boxSizing = style.getPropertyValue('box-sizing')

  const paddingSize = (
    parseFloat(style.getPropertyValue('padding-bottom')) +
    parseFloat(style.getPropertyValue('padding-top'))
  )

  const borderSize = (
    parseFloat(style.getPropertyValue('border-bottom-width')) +
    parseFloat(style.getPropertyValue('border-top-width'))
  )

  const contextStyle = CONTEXT_STYLE
    .map(name => `${name}:${style.getPropertyValue(name)}`)
    .join(';')

  return { contextStyle, paddingSize, borderSize, boxSizing }
}

// 盒子模型为content-box和border-box两种情况
export default function calcTextareaHeight(
  targetElement,
  minRows = 1,
  maxRows = null
) {
  // 创建一个textarea文本框，模拟目标文本框
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea')
    document.body.appendChild(hiddenTextarea)
  }

  const {
    paddingSize,
    borderSize,
    boxSizing,
    contextStyle
  } = calculateNodeStyling(targetElement)

  // 模拟文本框的样式为HIDDEN_STYLE的样式和目标文本框的样式
  hiddenTextarea.setAttribute('style', `${contextStyle}${HIDDEN_STYLE}`)
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || ''

  let height = hiddenTextarea.scrollHeight

  const result = {}

  // 如果是border-box,scrollHeight不包含border的值，所以要加上borderSize
  // 如果是content-box,scrollHeight包含了padding的值，可是该函数作用是计算目标textarea的height，所以要用height - paddingSize
  if (boxSizing === 'border-box') {
    height = height + borderSize
  } else if (boxSizing === 'content-box') {
    height = height - paddingSize
  }

  // minRows和maxRows是控制目标文本框的最小最大高度，不受文本框内容的影响
  // 无内容时的scrollHeight减去paddingSize就是一行的高度
  hiddenTextarea.value = ''
  const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize

  if (minRows !== null) {
    let minHeight = singleRowHeight * minRows
    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize
    }

    // 确定height的值
    height = Math.max(minHeight, height)
    result.minHeight = `${minHeight}px`
  }

  if (maxRows !== null) {
    let maxHeight = singleRowHeight * maxRows
    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize
    }

    // 确定height的值
    height = Math.min(maxHeight, height)
  }

  result.height = `${height}px`
  // 清除模拟文本框
  hiddenTextarea.parentNode && hiddenTextarea.parentNode.removeChild(hiddenTextarea)

  // 因为对dom进行了引用，触发垃圾回收机制？
  hiddenTextarea = null

  return result
}
