# 思路
## 结构
- 因为每个breadcrumb的子项基本相同，因此提供外层包装来控制样式和分隔符等
- breadcrumb-item用span标签，行内结构

## 表现
- seperator: 分隔符
- seperatorClass: 分隔符的图标
- gutter:自定义分隔符号的间隔

## 行为
- 用的nuxt.js，所以不设置router模式跳转，根据使用情况再考虑加入
