#关于UI结构
UI库放在路径src/components下,其中general是根据elment-ui学习编写的一个UI库，每个组件都有编写时的思路注释，每个组件下的README.md记录详细的组件编写资料。另一个文件夹official，是在书写遇·岛官网时的UI组件库，遇岛官网用的是nuxt.js

# 关于vue
## 计算元素位置
计算元素位置时注意是，一定要在nextTick中调用计算位置的函数

#关于样式
## 使用了scss
因为平时开发习惯使用了scss,所以在库中会见到很多scss的踪影，例如src/styles目录下的_variale.scss,记录着element-ui库中的颜色、公共样式(size不同的padding等）

- 前期只在_variale.scss作相关样式参数的记录，组件库中并未使用，后期会进行一个全局的替换

## scss引入
通常，@import 寻找 Sass 文件并将其导入，但在以下情况下，@import 仅作为普通的 CSS 语句，不会导入任何 Sass 文件。（所以scss直接引入就好）
文件拓展名是 .css；
文件名以 http:// 开头；
文件名是 url()；
@import 包含 media queries。

## official组件会用到的一些css技巧
[改进CSS](https://www.w3cplus.com/css/combining-the-powers-of-sem-and-bio-for-improving-css.html)

## 当一个元素的position为absolute或者fixed时
left:0;right:0;top:0;bottom:0;元素会铺满相对的定位元素或浏览器窗口
水平铺满:left:0;right:0;
垂直方向铺满:top:0;bottom:0;
子元素垂直居中:top:50%;
子元素水平居中:left:50%;
加上margin:auto

## 对于使用table-cell进行居中
table-cell的宽为100%并不会使该盒子铺满，该盒子的宽度会根据内容进行变化（内容不能铺满盒子，则盒子的宽度为内容宽度）

## box-sizing
- 并不全局使用box-sizing:border-box，只根据需要写入样式表

## classList和className
className 获取或设置指定元素的class属性的值。Element.classList是一个只读属性，返回一个元素的类属性的实时 DOMTokenList集合。使用classList是一个方便的替代方法，通过element.className作为空格分隔的字符串访问元素的类列表。

## 关于z-index的层叠次序
要深入了解

# 关于目录
## src/components/general/src

### utils/emmiter.js
组件mixins选项内容， [mixin混入策略](https://cn.vuejs.org/v2/guide/mixins.html) 
- broadcast用于在某个指定的子孙组件触发事件
- dispatch用于在某个指定的父祖组件触发事件
- 为什么要用concat传入apply的参数？因为要深复制参数，避免保留对params的引用？

## src/test
对开发组件时的疑问进行实际操作调试的页面文件，vue-router中以path以test开头

# 关于无障碍网页应用
无障碍网页应用组件的使用和注释会在后期补上

# 关于组件设计
## 自定义表单域组件的实现
思路是根据原生表单组件绑定值在vue上的实现，在其外面添加了一层双向数据绑定的包装

即原生表单组件绑定值在vue上的实现:v-model='value',value的实时状态变化来通过this.$emit('input'，value）来从自定义组件抛出一个值，从而改变在父组件绑定给自定义组件的值

## 组件的设计
组件的设计可以按照一个思维来设计:通过vue提供的数据流驱动，来分别控制结构、表现（样式）和行为

# 判断是否服务器端
1、 Vue方式
```javascript
import Vue from 'Vue'

const isServer = Vue.prototype.$isServer
```

2、是否存在window对象
```javascript
const isServer = typeof window === 'undefined';
```

# 工具函数的一些注意点
- 函数的参数应该利用ES6提供的定义默认参数
- 如果参数不可忽略，要在函数内进行判断，没传入参数throw new Erroro()
- 如果没用默认参数，避免执行时错，堵塞进程，应该进行判断，赋值新变量，值为执行代码所需要的数据类型的一个简单初始值，例如传入参数为对象时为“{}”，使用该变量进行下面语句的编写

# 关于apply和call
1、callback.apply(null, arguments)：第一个参数在func函数运行时使用的this值。需要注意的是，使用的this值并不一定是该函数执行时真正的 this 值，如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象（浏览器中就是window对象），同时值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的包装对象。

# 关于Vue
1、选项data和computed的数据都可以通过实例来访问吗?是的,instance.a和this.a的使用一样
2、render函数可以return html片段

## 编译过程
实例化组件 -> $mount或有el -> 开始编译成HTMLElement -> 插入到DOM的是vm.$el
[见生命周期](link)

# 数组中，如果项为对象，如何去重
用indexOf吗？

# 判断全填为真，全空也为真，（不可能的吧，只能用两个值来各自表示）
# 判断全填为真，全空也为假，含空为真（即有填但有空）（不可能的吧，只能多个值来各自表示）
即考虑去掉全空的时候，即|| || ||为假
即去掉全为空或全填的时候


# 关于设计组件的思想
1、结构、表现、行为
2、mvvm的思想的简化和编译，要设计一个model，相当于组件的数据中枢,这个数据model的数据是层级的，分等次的，即金字塔状，底层的数据是根据高层的数据派生的，例如设计switch组件，value，activeValue,inactiveValue是数据的一个中枢，为最高级，用来决定是否发布事件，用作判断是否设置或显示相关背景颜色，（即计算和监听），需要一个model来根据Vue的特性（vm）来更新view
3、数据层级的设计要根据组件的结构、表现、行为来设计，不过通常来说，最高层级的数据可以衍生出更高成绩的数据，即一开始最高层级的数据占据了顶层，可以最高层级的数据还是能相互结合，衍生更高层级的数据，占据了顶层，一开始数据最高层的数据确定可以用这几方面来思考：
- 视图组件的决定性状态：1、真或假 2、用一个值来表示状态（V-model）
- 结构、表现、行为

4、简单来说，就是结构、表现、行为 和model相互结合，model的数据和结构、表现、行为一一对应，建立好了金字塔的底层，然后金字塔的底层数据可以相互结合、派生、联系建立金字塔的高层（用vue来解决）

5、组价的默认model用来建立层级

即Model分为默认的组件结构、表现、行为和延展的组件结构、表现、行为，两种类型的组件架构的model可以相互结合、派生、进行computed/watch，建立金字塔更顶层的结构

## 面向对象的思维
可以将model看成一个对象，名称、特性、操作


用rate组件来举例：
- 考虑维护、扩展和复用
- 要想到这是一个给全部人用的组件

其实写可复用的组件，已经是从一个大类中抽象出子类，而子类就是我们要写的可复用组件(或者复杂来说，是抽象出不同层级的子类)，而写可复用组件时，该组件内的特性就是子类，子类可以进行抽象，例如根据结构、表现、行为来写组件，例如表现的颜色、排列等，有默认的值，也可以根据传入的props展现出不同表现的子类

分类完成后，需要考虑如何组织组件，复杂的可以先完成子类，再一步步组合

## 关于一个问题的思考
（这只是一个思考，如果是实际解决这个问题，是否不用正则也可以？）
求出1-100以7结尾的数字？
学了面向对象的思想后：要可维护、扩展和复用
思考：我将这看成一个对数字操作的对象，所以这会是一个构造函数
求7结尾的数字，是一个功能，这是一个子类(可能还有其他的子类)，子类应该是抽象类，所以应该是一个以求某数字结尾为目的子类
实现求一个数字后,要想：是否可以求多个数字，并返回结果，即问题的目的

然后OperateNumber可以拓展其他功能

如果用正则处理，是否只是对正则的简单封装就可以，并且不但一个函数只打到求以7结尾的结果

（当然，ES6中业务的写法可能有所不同）
```Javascript
function OperateNumber(number1, number2) {
    // ...
}
Operate.prototype.trail = function(target, trailReg) {
    // 对target进行操作
    // 如果对trailReg设置一个初始值，可用ES6语法，或者在函数体内进行一个判断
}
```
# vscode
## 终端链接谷歌项目
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

## 预览md
cmd + shift + v