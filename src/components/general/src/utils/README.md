# 事件
attachEvent和detachEvent支持捕获和冒泡机制吗？

# 事件绑定
once的写法

# 用到的一些库
Resize Observer：resize-observer-polyfill
节流和防抖动：throttle-debounce

# 关于PopupManager
popupManager主要用于操作DOM时弹出弹层的场景？还有dialog的遮罩层也会用到？popup的index.js是遮罩层？

我认为popupManager是用于管理网页中弹窗的实例的一个模块，而index.js是用于混入到vue组件中，以丰富弹出层组件的操作（细致思考这算不算发布订阅模式，我认为不算）

关于栈：ECMAScript数组也提供了一种让数组的行为类似于其他数据结构的方法。具体说来，数组可以表 现得就像栈一样，后者是一种可以限制插入和删除项的数据结构。栈是一种 LIFO(Last-In-First-Out， 后进先出)的数据结构，也就是最新添加的项最早被移除。而栈中项的插入(叫做推入)和移除(叫做 弹出)，只发生在一个位置——栈的顶部。ECMAScript 为数组专门提供了 push()和 pop()方法，以便 实现类似栈的行为。

再次理解：popupManager是创建一个模态框的动作过程，基本就是弹窗的一个抽象特点，instances是一个对象，用于记录当前操作的弹窗实例
instances的相关用来注册当前需要操作的modal
modalStack用来存放所有需要操作的modal

# 关于transition
1、collapse-transtion: render函数的参数{children} 指的是？ 
选项functional指的是？height = ''指的是不设置height，height为auto?
- functional:使组件无状态 (没有 data ) 和无实例 (没有 this 上下文)。他们用一个简单的 render 函数返回虚拟节点使他们更容易渲染
- 如果组件是一个函数组件，渲染函数还会接收一个额外的 context 参数，为没有实例的函数组件提供上下文信息。(所以{children}为上下文？)
- Vue 选项中的 render 函数若存在，则 Vue 构造函数不会从 template 选项或通过 el 选项指定的挂载元素中提取出的 HTML 模板编译渲染函数。
- chidren是context中的children  [transition](https://cn.vuejs.org/v2/guide/transitions.html)

# 关于scrollbar-width
scrollbar-width的获取是创建元素获取浏览器的原生scrollbar的宽度？

# 数组中的的项赋值null
[0, 1, null]

# scroll-into-view
滚动情况:是指滚动到container的某一个块，就是selected是container的一个个元素
要考虑到:
- 滚动的只是超过可视范围的那部分
