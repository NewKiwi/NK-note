# 思路
- 模拟的输入框，内部有input输入框，对输入框进行内容扩展，例如，前置后置内容(前置后置图标)，前置后置元素，清空（属于后置内容，有清空图标时，后置图标不渲染）
- 前置后置内容通过input的padding来实现
- 后置内容的是否渲染判断中有validateState && needStatusIcon，前者是form-item的验证状态，后者是form的statusIcon
- 有前置或后置内容为input组
- 原生input和textarea标签中的v-bind:$attrs是把未定义props值或已定义的props绑定（可以说是简写，具体作用见 [$attrs](https://cn.vuejs.org/v2/api/#vm-attrs)）

#calcTextareaHeight的实现思路

## 相关计算知识点
[CSS操作](http://javascript.ruanyifeng.com/dom/css.html#toc0)

1、CSSStyleDeclaration 接口用来操作元素的样式。三个地方部署了这个接口。
- 元素节点的style属性（Element.style）
- CSSStyle实例的style属性
- window.getComputedStyle()的返回值

Element.style返回的只是行内样式，并不是该元素的全部样式。通过样式表设置的样式，或者从父元素继承的样式，无法通过这个属性得到。元素的全部样式要通过window.getComputedStyle()得到。

window.getComputedStyle方法，就用来返回浏览器计算后得到的最终规则。它接受一个节点对象作为参数，返回一个 CSSStyleDeclaration 实例，包含了指定节点的最终样式信息。所谓“最终样式信息”，指的是各种 CSS 规则叠加后的结果。
const style = window.getComputedStyle(targetElement)
style.getPropertyValue()

2、clientHeight、scrollHeight和offsetHeight
- clientHeight: Element.clientHeight属性返回一个整数值，表示元素节点的 CSS 高度（单位像素），只对块级元素生效，对于行内元素返回0。如果块级元素没有设置 CSS 高度，则返回实际高度。
除了元素本身的高度，它还包括padding部分，但是不包括border、margin。如果有水平滚动条，还要减去水平滚动条的高度。注意，这个值始终是整数，如果是小数会被四舍五入。
Element.clientWidth属性返回元素节点的 CSS 宽度，同样只对块级元素有效，也是只包括元素本身的宽度和padding，如果有垂直滚动条，还要减去垂直滚动条的宽度。
document.documentElement的clientHeight属性，返回当前视口的高度（即浏览器窗口的高度），等同于window.innerHeight属性减去水平滚动条的高度（如果有的话）。document.body的高度则是网页的实际高度。一般来说，document.body.clientHeight大于document.documentElement.clientHeight。

- scrollHeight:
Element.scrollHeight属性返回一个整数值（小数会四舍五入），表示当前元素的总高度（单位像素），包括溢出容器、当前不可见的部分。它包括padding，但是不包括border、margin以及水平滚动条的高度（如果有水平滚动条的话），还包括伪元素（::before或::after）的高度。

- offsetHeight: 包含滚动条框的高度
属性返回一个整数，表示元素的 CSS 垂直高度（单位像素），包括元素本身的高度、padding 和 border，以及水平滚动条的高度（如果存在滚动条）。

##思路
- 因为textarea一开始是由rows来控制高度的，要改变要通过css
- textarea的调节高度要用scrollHeight来计算(scrollHeight不受元素style.height的影响)
- 最小和最大高度用模拟文本框value === ''时的一行的内容高度来计算

#拓展
## compositionstart/compositionupadte/compositionend
[compositionstart](https://developer.mozilla.org/zh-CN/docs/Web/Events/compositionstart)
[compositionupadte](https://developer.mozilla.org/zh-CN/docs/Web/Events/compositionupdate)
[compositionend](https://developer.mozilla.org/zh-CN/docs/Web/Events/compositionend)
IME 是指 Input Method Editors 输入法编辑器
复合事件是DOM3级事件中新添加的一类事件，用于处理IME的输入序列。IME（Input Method Editor，输入法编辑器）可以让用户输入在物理键盘上找不到的字符。有以下三种复合事件： 
compositionstart：在IME 的文本复合系统打开时触发，表示要开始输入了。
compositionupdate：在向输入字段中插入新字符时触发。
compositionend：在IME 的文本复合系统关闭时触发，表示返回正常键盘输入状态。
（摘抄自网络）

## 组件中的方法可以通过组件实例调用
例如：
- select()
- blur()
- focus()

## this.$el
this.$el.querySelector()

## 防止报错，堵塞进程
提供初始值
例如组将中：
- this.$ELEMENT || {}
- this.elForm || {}

# 问题
1、当组件只有一个父组件时，this.$root和this.$parent是不是一样？
2、this.$vnode是否指向自身？this.$vnode.data.attrs指的是什么？this.$vnode.listeners?
3、this.$ELEMENT指向什么?
在整个组件库的的index.js引入中, 对Vue的原形进行了操作，添加了$ELEMENT属性

4、this.$on()如何触发事件？用$emit可以，如果我注册组件后，在组件用@绑定事件，再执行行不（我理解不行）
5、resizeTextarea()中服务端不执行计算高度目的是？
6、inject的default