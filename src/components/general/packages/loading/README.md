#目录结构
(loading组件有三种方式实现)
1、loading.vue:组件方式(该组件只是为了2和3用Vue构造器创建子类作准备，如果用组件实现，要考虑样式定位以及显示隐藏控制问题)
2、index.js:服务方式
3、directive.js:指令方式

#实现
## 组件方式
- loading-fade：只是opacity的过渡

## 服务方式

## 指令方式
- Vue.extend( options ),使用基础Vue构造器，创建一个“子类”。参数是一个包含组件选项的对象。 [Vue.extend](https://cn.vuejs.org/v2/api/#Vue-extend)
- className和classList, classList的add()、remove()、toggle()以及contains(),String的indexOf
- const ieVersion = isServer ? 0 : Number(document.documentMode);documentMode判断IE的版本
- getStyle和setStyle的写法
- [自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html#ad)
- laoding有三种修饰符:fullscreen, body, lock,fullscreen是全屏遮罩（相对于浏览器定位，fixed）
- 修饰符为body时，获取的时绑定指令元素的宽和高，再相对于body定位，这是否有错误？这样的话loading的宽高就是元素的宽高，只是相对定位的元素不同而已。（思考：body修饰符的意义是什么，适用于整屏的大图轮播网站？）

# 拓展
1、transition组件的的事件： [transition](https://cn.vuejs.org/v2/api/#transition)
2、utils目录下popup的index.js中，export default和export共用
3、Element.getBoundingClientRect方法返回一个对象，提供当前元素节点的大小、位置等信息，基本上就是 CSS 盒状模型的所有信息。
4、指令方式：loadingDirective.install，直接拓展Vue，提供插件式的指令？ [install](https://cn.vuejs.org/v2/api/#Vue-use)
5、overflow:visible:
overflow这个属性定义溢出元素内容区的内容会如何处理。如果值为 scroll，不论是否需要，用户代理都会提供一种滚动机制。因此，有可能即使元素框中可以放下所有内容也会出现滚动条。
auto:如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容。
visible:默认值。内容不会被修剪，会呈现在元素框之外

# 问题
1、hasClass函数中return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;为什么要这样return

2、指令方式的bind的和unind的触发过程？update钩子为什么要调用setText

调用setText我认为是因为触发update钩子太多，因此要保证值的更新。

3、document.body[scrollTop],document.documentElement[scrollTop],可以这样读取scroll的吗？

4、通常页面的滚动条，自动滚动时，主要是window的scroll还是html?还是body?当修饰符是body时为什么判断scrollTop时，要减去body的margin

5、了解ES6的import的export是动态还是静态
[es6 Module](http://es6.ruanyifeng.com/#docs/module#%E6%A6%82%E8%BF%B0)
[JavaScript 模块的循环加载](http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html)
[Javascript模块化编程](http://www.ruanyifeng.com/blog/2012/10/javascript_module.html) (看完点击下一篇)  
#词汇
popup：弹出
spinner: 旋转指针?