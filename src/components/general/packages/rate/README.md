# 思路
## 结构


## 表现
默认：
1、当前分数（value），最大分数（max）
2、只读（disabled）
3、星标的颜色显示（value和max的比较），星标的active颜色和inactive颜色（inactive-color,active-color）
延展：
4、区分颜色，即提供从低分到高分的一个层级颜色，分数低中高，提供阈值和颜色变化（low-threshold和high-threshold,颜色变化用数组来表示）（可以去掉active和inactive，有默认颜色）(设置默认颜色和默认阈值就可以设置默认的无层级rate组件)
5、辅助文字，数组，和分数相对应
6、分段图标，低中高分


## 行为
1、星标颜色根据value和max确定，鼠标移入和移出会触发星标颜色的改变，且size变大，点击就改变实际的value


## model
value,max,disabled,low-threshold,high-threshold,colors

表现的3和表现的1:
3 -> value <= max时，星标active
1 -> 鼠标移入移出只是一个不确定状态,不可以改变value,所以3和1结合要解决

解决方案：
1、增加多个中间变量，用来增加active图标的判断(itemValue指的是每个星标代表的value)？:activeValue <= itemValue || value <= itemValue （activeValue的初始值大于value）
2、解耦,不添加这么多判断，用一个hoverIndex来判断是否active？而且还能有hover时size变大
3、既然是有移入移出，就用一个currentValue来控制星标就可以了，移入currentValue = 传入的value，移出等于value