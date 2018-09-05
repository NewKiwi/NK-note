# 思路
- 模拟一个radio组件,根据input的raido单选框的vue实现，用其状态的变化来控制组件的变化
- label为原生input绑定的值, v-model='model',利用一个双向的computed来计算model,实现双向数组绑定
- 多个单选框的组用radio-group来模拟
- label标签为组件的根元素
