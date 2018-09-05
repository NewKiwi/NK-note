# 设计

## 表现
- button,默认box-sizing为border-box
- nativeType,默认为button
- shape：形状
  - normal 有个小小的圆角
  - round 大圆角
  - circular 圆形的
  - square
- size：大小
  - large
  - middle
  - small
- type：类型
  - primary
  - danger
  - warning
  - text: 文字按钮
- loading
- icon
- plain
— disabled
- border:字符串样式，默认为none
- padding: 传入padding,改变默认的样式
- width: 传入width, 固定button的宽度

## 设计稿数据
- shape:
  - circular: padding:15; 10; 32;
  - rect: padding: 5;
- size:(根据数据，暂时不用size控制按钮大小，而是用传入的width/padding让用户自定义)
  - padding: 16 65;
  - padding: 10 40;
  - padding: 16 50;
  - padding: 12 22;
  - padding: 14 36;
  - padding:  8 30;
- 按钮只有有边框和无边框，而且有边框的文字颜色和边框一样，plain类型为边框的按钮，而背景颜色为透明，有默认颜色，也可以通过bgColor改变,字体颜色通过color改变