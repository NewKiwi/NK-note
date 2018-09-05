# 目录结构
1、 message.js，注册$message方法
2、 message.vue，message组件，为注册方法准备

# 一些功能
- 鼠标移进移出事件，移进不关闭，移出重新计时关闭
- 定时时间过后销毁组件
- 中间变量closed控制组件销毁

# 拓展
1、生命周期的实例方法有：
实例方法 / 生命周期
vm.$mount
vm.$forceUpdate
vm.$nextTick（全局为Vue.nextTick）
vm.$destroy: [在大多数场景中你不应该调用这个方法。最好使用 v-if 和 v-for 指令以数据驱动的方式控制子组件的生命周期。](https://cn.vuejs.org/v2/api/#vm-destroy)

2、transitionend事件

3、判断是否是Vnode-》componentOptions属性值

# 问题
1、$destroy(true)，为什么要传入true作为参数

2、Vnode的componentOptions属性值是什么？

3、实例化的Vue组件（包括基础构造器），直接给实例赋值，是赋值到data吗？

4、instance.message为什么是vnode

5、基础构造器extend()实例化的组件的参数对象中，对data的赋值是不是对原组件data执行类似Object.assign的操作

6、instance.vm = instance.$mount();指的是？

7、了解Message(),以及Message.type()函数的创建方法

8、当slot中有默认显示的内容，实例化组件时，实例的$slots会不会有default属性
不会

9、message.js中instance.$mount()的目的是？
实例化组件时存在el属性，在实例挂载之后，元素可以用 vm.$el 访问。
如果在实例化时存在这个选项，实例将立即进入编译过程，否则，需要显式调用 vm.$mount() 手动开启编译。
message中， instance.$mount() 使用前和使用后控制台返回的结果中都有$el, 可是挂载前使用instance.$el返回的是undefined

10、根据第9个问题，实例进入编译指？
根据9来推论，应该是编译成HTMLElement 