#思路
- 实现和radio组件基本一样，不过要处理多选的情况，即group绑定值为Array时如何处理双向数据绑定，以及处理checked状态
- 以及处理全选
- checkbox-group其实只是为多个checkbox提供了一层外层包装，最终都是多个checkbox绑定同一个值

1、处理group绑定值为Array的情况:checkbox的input绑定值即为group绑定的值(无论是字符串还是数组)

2、处理checked状态: cheked状态有三种情况:Boolean,true-label存在下以及等于数组中的某个值。
当为isGroup时，checkbox的input绑定值即为group绑定的值，判断该值是否为数组，若数组，
判断label(checkbox本身value绑定值)是否等于其中一项，等于即为checked状态

# 重要问题
如何实现全选？
1、通过在checkbox-group中进行绑定数据值的赋值，实现全选？（对子组件的label进行获取，操作麻烦）
element的做法是：通过无障碍网页应用技术
WAI-ARIA是指无障碍的网页应用技术。
WAI-ARIA , 是Web Accessibility Initiative - Accessible Rich Internet Applications 的缩写，她主要解决的一个问题：让残障人士能无障碍地访问网页上的动态内容。
the Accessible Rich Internet Applications Suite, 可帮助访问Web内容和Web应用有困难的用户进行访问的方法（比如用静态的(screen-reading technologies)浏览器浏览用Ajax技术制作的动态网页）。
它尤其帮助动态内容和用Ajax, HTML, JavaScript和相关技术开发的高级用户接口控件。--》所以element-ui用了这个来开发？

[ARIA](http://www.zhangxinxu.com/wordpress/2012/03/wai-aria-无障碍阅读/)

ariaControls该属性定义了元素间不能通过文档结构决定的关联关系。ariaControls属性主要被role为group, region, 或widget的元素使用。

## aria-checked
字符串。表示检查的状态。true表示元素被选择；false表示元素未被选择；mixed表示元素同时有选择和未选择状态。

## 实现
(checkbox-group的根元素要有role="group" aria-label="checkbox-group"两个特性)

通过给checkbox-group设置特性role='group', 全部的check-box的role="checkbox"（包含indeterminate为真的check-box），然后再在indeterminate为真的check-box根元素中设置aria-control特性,值和控制的check-box的id值相同,而且aria-checked的值为mixed(被控制的check-box根元素的aria-checked的值为isChecked的值)

## 文档的实现
文档的实现是controls和id都为undefined

# 问题
1、单个原生checkbox不绑定布尔值会怎样?单个原生checkbox绑定数组会怎样？
除数组外，全部会转换成Boolean,单个原生checkbox绑定数组，会往数组添加或删除值

2、假如check-group的min === 2，一开始初始化时选择为0个，如果这时点击check-box，this.model的值是什么，点击两次后呢

3、原生checkbox和radio有input事件的吗

4、为什么已经用$emit('input')抛出值进行双向数据绑定了，还要绑定change事件？
因为要抛出change事件在父组件中调用

5、props中的prop设置了type,如果没设置default，不同的数据类型其初始值为什么
undefined