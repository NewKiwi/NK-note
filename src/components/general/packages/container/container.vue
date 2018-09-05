<!--
命名：is-xxx
slots: 当父组件中，没有插槽内容，this.$slots会返回什么，有又会返回什么，this.$slots.default呢
      没有，this.$slots === {}, this.$slots.default === undefined
      有,this.$slots会返回一个包含default属性的对象(有具名插槽时会多一个具名的属性)，this.$slots.default是包含一个或多个VNode的数组
Array.some():过滤

componentOptions:this.$slots.default中的VNode中的componentOptions的tag如何来的？把nk-header组件的名字什么的都删除仍然有(tag中的nk-header是components中注册的名字,固定只能用nk-header命名的元素)

computed中的isVerticle
// return VNode.componentOptions === 'Nk-header' || VNode.componentOptions === 'Nk-footer'
不建议上面这种写法，应该先赋值变量，以作标记

flex-direction:column,是指主轴在垂直方向

nk-container样式中一定要有flex:1, 这是container嵌套时保证样式的正确
-->
<template>
  <section class="nk-container" :class="{ 'is-verticle': isVerticle }">
    <slot></slot>
  </section>
</template>

<script>
  export default {
    name: 'NkContainer',

    componetName: 'NkContainer',

    props: {
      direction: String
    },

    computed: {
      isVerticle() {
        if (this.direction === 'verticle') {
          return true
        } else if (this.direction === 'horizontal') {
          return false
        }
        return this.$slots.default
          ? this.$slots.default.some(VNode => {
            const isHeaderOrFooter = VNode.componentOptions && (VNode.componentOptions.tag === 'nk-header' || VNode.componentOptions.tag === 'nk-footer')
            return isHeaderOrFooter
          })
          : false
      }
    }

    // created() {
    //   console.log(this.$slots)
    //   console.log(this.$slots.default)
    // }
  }
</script>

<style>
  .nk-container{
    display: flex;
    box-sizing:border-box;
    flex:1;
  }
  .nk-container.is-verticle{
    flex-direction:column;
  }
</style>
