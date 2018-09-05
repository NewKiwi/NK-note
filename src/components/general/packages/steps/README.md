#思路
## 结构
- 横向、竖向
- 外层包装提供步骤和结构控制
- 

## 表现
- 未进行状态、当前进行状态、已完成状态、失败、成功的不同样式
- icon
- 横竖向
- 风格
- 每个step的距离，默认水平两端对齐

## 行为
- 外层包装的active控制内部step的成功、进行以及未进行状态

# 问题
1、mounted的监听写法？
[unwatch](https://cn.vuejs.org/v2/api/#vm-watch)
vm.$watch 返回一个取消观察函数，用来停止触发回调。

2、immediate:true 指的是？
在选项参数中指定 immediate: true 将立即以表达式的当前值触发回调

