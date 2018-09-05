#Form

#关于结构
- form是一个表单组件
- 表单域由form-item组成，单个或多个表单域组成一个form

#关于内容、样式
- 表单域默认垂直排列，行内表单需要控制
- label宽度由祖先组件form控制，即form-item的width包含label-width和剩下的width，剩下的width给表单组件使用
- 表单验证信息显示由form控制
- 表单域的表单组件input等是独立的，form控制全局表单的结构、状态等，form-item对表单域组件form-item提供了一层包装

#思路
- form组件作为祖先组件，相当于提供了表层的包装，也是一个总控制组件
- 控制form-item的label-width, 控制表单的的label的对齐，label-suffix控制表单域标签的后缀(即在label的内容后增加字符串)
- 提供表单域中表单组件的双向绑定值model(通过provide选项将整个实例this传入子孙组件)
- 控制表单是是否行内表单(样式用display:inline-block控制，如果用float浮动，要处理好多情况。例如一个左浮动列表布局，如果第一行有个列表高度高于其他列表，那就在第二行，第一个元素会沿着最高元素的右侧对齐，而行内元素的高度：每一行所有的inline元素和inline-block元素会共同形成一个line boxes，这个line box的高度由里面最高的元素决定，因此不会有交错)（display:inline-block垂直方向有空隙，用verticle-align:top去除）
<b>因此可以用inline-block来实现等高布局,父元素设定宽度和对齐方式，子元素inline-block即可</b>
- required的“*”用伪元素实现
- objectAssign函数用来实现ES6的Object.assign,注意：该函数和Object.assign实现的是对象可枚举属性的浅复制，源对象中如果有个属性的值是对象a，目标对象复制后属性值保留着对对象a的引用

#问题
1、[provide和inject](https://cn.vuejs.org/v2/api/#provide-inject),provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。这么说，form传入实例this是否可响应的？如果不是传入this,传入一个对象，对象中提供一个方法，return当前form组件传递的响应的值，是否该传入的值还是响应的？

#扩展
1、不常使用的伪元素
:first-letter   向文本的第一个字母添加特殊样式。
:first-line     向文本的首行添加特殊样式。

2、文字环绕图片可以使用float实现，因为float破坏了line box

3、判断数组是否有该条目
arr.indexof(item)

