# 思路
— 为了扩展评分的更新功能，使用value传递评分的值， 若扩展使用v-model进行双向数据绑定就可以
- 官网只有只读评分，以及不同背景色和半星，使用props控制该三个状态并在computed中进行计算，以便以后扩展
- 增加iconClass，使用不同的Icon
- value只是分值，星星或icon的数量需要max来控制, 考虑到value会用作双向数据绑定，组件内用currentValue来作中间值

## 结构
- 使用span做行内排列

# 疑问
- template中直接调用函数来求值，函数执行是否响应式的？ （我认为不是）