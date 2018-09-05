# 前序
- 该ui库为自己编写，并且用了面向对象的思想，因为时间问题，不会阐述过多的开发过程，工作闲时会逐渐补上UML类图（正在学习中）
- 因为维护和拓展原因，注释并不会过多，而是用一个明确而长的命名来取代大部分注释

# 目录
- packages存放的是组件库
- src存放的是资源文件
  - style 样式文件夹
      - index.scss 总样式文件
      - _variable.scss 样式的一些变量以及字体
      - _Gmixin.scss 样式的一些全局mixin
  - utils
    - scrollbar-width.js 考虑组件实例化多次会执行多次，要进行一个值的判断

# 一些样式注解
- user-select:none; 用于文本不能被选择的元素，例如button
- pointer-events: none; 用于disabled
- speak:none; 屏幕阅读器阅读的控制，用于icon等
- 抗锯齿：通常用于chrome,safari中的图标字体渲染
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
- 鼠标样式：cursor: not-allowed; 用于button不可用等不可用场景

# 一些对现在的开发有用的样式拓展
- transform实现矩阵变形，可用于平滑的折叠和展开，类似于collapse

# provide的响应
测试路由是 official/breadcrumb
provide的时候
```javascript
// 子孙组件获取的数据是响应式的
provide() {
  return {
    name: this
  }
}
```
假如return块中含this的数据，仍然是响应式的
```javascript
// 子孙组件获取的数据是响应式的
provide() {
  return {
    name: this.broadcast
  }
}
```
