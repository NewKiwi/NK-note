import Vue from 'vue'

let scrollbarWidth
export default function() {
  if (Vue.prototype.$isServer) return 17
  if (scrollbarWidth !== undefined) return scrollbarWidth

  const STYLE_MAPS = {
    position: 'absolute',
    top: '-9999px',
    visibility: 'hidden',
    width: '100px',
    height: '100%',
    overflow: 'scroll'
  }
  const outer = document.createElement('div')
  Object.keys(STYLE_MAPS).forEach(prop => {
    outer.style[prop] = STYLE_MAPS[prop]
  })
  document.body.appendChild(outer)

  const outerOffsetWidth = outer.offsetWidth

  const inner = document.createElement('div')
  inner.style.width = '100%'

  outer.appendChild(inner)
  const innerOffsetWidth = inner.offsetWidth

  scrollbarWidth = outerOffsetWidth - innerOffsetWidth
  outer.parentNode.removeChild(outer)

  return scrollbarWidth
}
