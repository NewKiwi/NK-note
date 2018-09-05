#前序
用于布局的容器组件，方便搭建页面的基本结构

思路：
- 布局容器以flex布局为主，为了兼容性也可以考虑table布局,该组件
- 布局要有主容器，样式为display:flex或者display:table，主容器的type有两种：flex和table，该组件暂时不考虑table布局
- 页面布局子元素通常有四个：header(顶栏容器)、aside(侧边栏容器）、main(主要区域或者内容容器)、footer（底栏容器）
- 注意，flex布局的子元素无论是块级还是行内元素，默认都是水平排列
- 在第三点和第四点的结构和行为下，如何布局使aside和main是水平排列，header和footer垂直排列？判断子元素容器是否有header或者footer，有则flex-direction:row,无则flex-direction:column
- 在上一点的判断情况下，可以在container容器加多一个特性：direction,控制子元素的的排列
- 体现了一个思想：单向，父组件可以控制子组件的状态，或者父组件根据子组件的状态可以控制子组件的状态

关于数据流的思考:
[单项数据流和双向数据流](https://www.zhihu.com/question/49964363)
- 解决词汇：多级联动菜单、单向数据流和双向数据流的优缺点、主要是：什么是单向数据流、双向数据流
- 单向数据流的一些疑难解决：用一个双向的computed或用传统的watch，主要是数据过渡
- 单向数据流是指父组件可以传递状态给子组件，而子组件不可以改变该父组件的状态（vue的.sync修饰符就是双向的）
- 另外关于论点：只有UI控件才存在双向，非UI控件只有单向？ 这句话是否正确
- UI控件是什么？非UI控件是什么

解释：
- 多级联动菜单：一个菜单的数据变化会引起下一级菜单的数据的变化，双向数据流适用于多级联动菜单，因为要实时反映用户输入（为什么这会是双向数据流？？？）
- 单向数据流：state->view->action->state, 那vuex是双向吗？（理解中不是,只是一个状态共享仓库，还是通过action来改变state，影响view）
- 在双向数据流中，Model(可以理解为状态的集合)中可以修改自己或者其他Model的状态（例如input1中的Model的值改变会使input2中的Model值，通过watch和computed都可以），用户的操作（如在输入框中输入内容）也可以改变状态，这是改变一个状态有可能触发一连串的变化，最后难以预测最终的状态是什么，代码很难调试，  而单向数据流，像vuex，只能重新走一个修改的流程，让状态可控、容易调试
- 所以，https://www.zhihu.com/question/49964363  中的v-model支持双向绑定，但引入了vuex后不行，可以通过一个中间量来解决（watch或者computed）
- 问题：computed可以双向吗？(短路求值可以双向，||,还是通过get和set?)
- UI控件、非UI控件   控件是指对数据和方法的封装，控件可以有自己的属性和方法

总结：
v-model是双向绑定

## 组件组成思考
- container section标签，样式flex, slot插槽, props属性direction, direction值为vertical或horizontal，默认要根据子元素来判断
- header header标签，props属性为height，slot 默认高60px
- footer footer标签，props属性为height，slot 默认高60px
- aside aside标签，props属性为width, slot, 默认宽300px, 注:overflow要auto
- main  main标签，flex:1  注:overflow要auto
- 如何保证container的子元素就是这四类，这四类的父元素就是container（created后判断？还是mounted后判断？通过$children和$parent判断）（不用判断）


##确认的组件组成
1、container的样式要有flex:1，保证嵌套的样式的作用
2、要类似圣杯布局的，必须嵌套多层container（aside和main同时存在时）
