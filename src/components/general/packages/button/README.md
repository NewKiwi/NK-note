#前序
（总思路: props控制结构、表现以及行为）
按钮就是用来操作的

- 按钮的用法分类：默认、信息、成功、警告、危险
- 按钮的类型分类：默认、朴素、圆角、图标（带有图标、文字）、文字按钮
- 按钮的大小分类：迷你、小、中、大(默认)
- 按钮的组合：按钮组

都是用递增颜色来显示内容

特性：
size: mini small medium三种size
type: primary / success / warning / danger / info / text
round:
circle:
loading:
icon:
plain:
disabled: 控制样式，并且用样式表来控制事件的发生
autofocus:
native-type:reset submit button

- autofocus:规定当页面加载时按钮应当自动地获得焦点,对应样式表:focus选择器
- :hover鼠标悬浮  :focus选择获得焦点的输入字段，并设置其样式,接收键盘事件或其他用户输入的元素都允许 :focus 选择器。
- :link 选择器设置指向未被访问页面的链接的样式，:visited 选择器用于设置指向已被访问的页面的链接，:active 选择器用于活动链接。当您在一个链接上点击时，它就会成为活动的（激活的）
- 注释：在 CSS 定义中，:hover 必须位于 :link 和 :visited 之后（如果存在的话），这样样式才能生效。

##思路
- props控制按钮特性
- 按钮组父组件控制子组件样式
- size、type控制大样式
- round、circle、disabled控制小样式
- loading、icon控制图标显示
- autofocus控制原生属性
- loading为真时和disabled行为一样
