# 思路

## 结构
- 外层包装和轮播元素两个组件
- 外层包装控制轮播元素的滚动
- 自定义指示器和轮播箭头，自定义指示器用作用域插槽?，轮播箭头用具名插槽
- 垂直轮播或者水平轮播

## 行为
### 关于自定义
- 自定义指示器，使用时，在自定义指示器上触发carousel组件的throttleIndicatorHover以及handleIndicatorClick，传入指示器的index
- 自定义箭头 使用时，在自定义箭头上触发carousel组件的throttleArrowClick

# 注意点
- updateChildren用filter()返回新数组
