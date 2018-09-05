# 目录结构
main.js: 整一个scroll-bar组件，提供了scroll-bar的整体（bar和track）
bar.js: 滚动条的thumb
util.js: 滚动条用到的组件内工具函数

# 思考
如何实现一个模拟的滚动条？
1、不用原生滚动条时，滚动条应该为于body的子元素，或者是某一个DOM节点中的子元素，当滚动条的父元素的滚轮事件发生时，通过prop传值控制滚动条的thumb的transform的translateX或translateY的方向的滚动。（但是当滚动滚动条或者拖动滚动条时，也应该控制页面的滚动，所以我觉得是双向数据的绑定）
2、可是这样实现仍然需要计算数值进行数据绑定，是否应该提供外层包装，srollbar里面的内容会随着bar的滚动而滚动

# 实现
1、scrollbar提供外层包装，只要在slot提供内容，自动计算滚动的值模拟滚到条，类似于小程序的scroll-view,就不用进行双向数据绑定了


#问题
1、render函数为什么使用的是onMousedown
bar.js中的render函数用的是JSX语法
JSX:Javascript和XML结合的一种格式,XML-like syntax extension to ECMAScript
[Vue使用JSX的语法](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage)

2、clientY, clientHeight和scrollHeight
Element.clientHeight属性返回一个整数值，表示元素节点的 CSS 高度（单位像素），只对块级元素生效，对于行内元素返回0。如果块级元素没有设置 CSS 高度，则返回实际高度。除了元素本身的高度，它还包括padding部分，但是不包括border、margin。如果有水平滚动条，还要减去水平滚动条的高度。注意，这个值始终是整数，如果是小数会被四舍五入。

Element.scrollHeight属性返回一个整数值（小数会四舍五入），表示当前元素的总高度（单位像素），包括溢出容器、当前不可见的部分。它包括padding，但是不包括border、margin以及水平滚动条的高度（如果有水平滚动条的话），还包括伪元素（::before或::after）的高度。

clientHeight不包含溢出容器、当前不可见部分。

document.documentElement的clientHeight属性，返回当前视口的高度（即浏览器窗口的高度），等同于window.innerHeight属性减去水平滚动条的高度（如果有的话）。document.body的高度则是网页的实际高度。一般来说，document.body.clientHeight大于document.documentElement.clientHeight。

mouseEvent接口：接口代表了鼠标相关的事件。
clientY:MouseEvent 接口的实例属性,MouseEvent.clientX属性返回鼠标位置相对于浏览器窗口左上角的水平坐标（单位像素），MouseEvent.clientY属性返回垂直坐标。这两个属性都是只读属性。

3、document.onselectstart
GlobalEventHandlers.onselectstart 表示 selectstart 事件绑定的事件处理器，比如用户在网页上开始选择任意文本内容时触发。
译者注：在输入控件中选择文本时，触发的是控件绑定的 select 事件。

4、destroyed为什么要off事件

5、e.stopImmediatePropagation()
如果某个元素有多个相同类型事件的事件监听函数,则当该类型的事件触发时,多个事件监听函数将按照顺序依次执行.如果某个监听函数执行了 event.stopImmediatePropagation()方法,则除了该事件的冒泡行为被阻止之外(event.stopPropagation方法的作用),该元素绑定的<b>后序</b>>相同类型事件的监听函数的执行也将被阻止.

6、getBoundingClientRect:由于元素相对于视口（viewport）的位置，会随着页面滚动变化，因此表示位置的四个属性值，都不是固定不变的。如果想得到绝对位置，可以将left属性加上window.scrollX，top属性加上window.scrollY。

注意，getBoundingClientRect方法的所有属性，都把边框（border属性）算作元素的一部分。也就是说，都是从边框外缘的各个点来计算。因此，width和height包括了元素本身 + padding + border。

另外，上面的这些属性，都是继承自原型的属性，Object.keys会返回一个空数组，这一点也需要注意。

7、
MDN中：
event.preventDefault
取消事件（如果该事件可取消）。

8、computed是多层响应吗？即嵌套式的对象时。computed的属性，第二层对象可以直接赋值？