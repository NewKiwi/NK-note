#思路
##结构
1、用checkbox来模拟
2、true-value和false-value

##表现
1、text的颜色
2、开启和关闭时的颜色

##行为
值的变化发布$emit('input')事件，改变v-model绑定的值，同时触发动画,还有改变颜色