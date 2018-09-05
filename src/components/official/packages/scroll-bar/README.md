#思路
- 使用场景，是改变浏览器的滚动条
- 至于滚动触发动画功能也用该组件实现，我认为不妥，过度地组件化功能了，应该组件的scroll事件触发时，发布一个事件，抛出滚动值来控制组件分发内容动画的实现
- 滚动条建议使用到节流函数(这里暂时没用，没测试效果)
- scroll-into-view可以在该组件实现，官网设计中没用到，暂时不实现
- 因为是模拟浏览器的滚动行为，外层包装（以下为container组件）的大小变化应该要实现滚动条的变化来对其进行响应，因此使用resizeObserver的polyfill, 可是响应resize的变化会损耗性能，因此要对其实现一个开关(noresize)

## 结构
- bar组件
  - container组件的滚动事件影响bar的滚动(move, bar的移动距离)
  - bar的拖动和bar-track的点击影响container的滚动
  - bar的宽度或者高度由container的视口可视范围以及实际范围求出,用container来总分配值
  - bar是纵向还是横向（direction）
  - bar的高度根据container视口可视范围和container元素offsetWidth或offsetHeight求出(size)
- container组件
  - utils中的scroll-width用来求出原生滚动条的高度或者宽度，用于设置container的margin-bottom以及margin-right,以不显示原生滚动条

## 表现
- container组件的有鼠标悬停时，bar组件才会显示出来
- bar组件鼠标悬停时，颜色更深
- bar组件的宽和高应该由container组件控制，当不产生滚动时，bar高度为0
- 当点击bar时，更贴切地模拟用户的行为，应该为document绑定mousemove和mouseup事件，因为用户有时会拖动鼠标在bar的外面进行滑动，以此同时也应该不能选择document的文本,禁用选中事件onselectstart = () => false
- container组件本身的overflow为scroll，因为值不为scroll，就没有scroll事件（或者用鼠标事件模拟也可以)

- 要实现滚动，scroll-bar组件一定要有一个高度，不然最外层scroll-bar的高度和container的高度一样，container是没有滚动事件的

# 拓展
## Vue
- render函数内的JSX都会渲染，并且可以获取, 子组件可以通过$parent来操作父组件
- render函数的JSX语法 [JSX](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage)

## DOM
- onselect是输入框的事件

## JS
- 0转换为布尔值为false,负数和正数为true

## 事件
- Event.currentTarget属性返回事件当前所在的节点，即正在执行的监听函数所绑定的那个节点。
- Event.target属性返回原始触发事件的那个节点，即事件最初发生的节点。事件传播过程中，不同节点的监听函数内部的Event.target与Event.currentTarget属性的值是不一样的，前者总是不变的，后者则是指向监听函数所在的那个节点对象。
- Event.currentTarget在console.log中，为DOM节点，如果console(event),返回的事件对象中currentTarget为null

## 滚动
浏览器会自动判断最大最小值
- scrollTop 可以被设置为任何整数值，同时注意：
  - 如果一个元素不能被滚动（例如，它没有溢出，或者这个元素有一个"non-scrollable"属性）， scrollTop将被设置为0。
  - 设置scrollTop的值小于0，scrollTop 被设为0
  - 如果设置了超出这个容器可滚动的值, scrollTop 会被设为最大值.