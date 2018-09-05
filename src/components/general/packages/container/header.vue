<template>
  <header class="nk-header" :style='style'>
    <slot></slot>
  </header>
</template>

<script>
  export default {
    name: 'NkHeader',

    componentName: 'NkHeader',

    props: {
      height: {
        type: [String, Number],
        default: '60px'
      }
    },

    computed: {
      style() {
        const obj = {}
        if (typeof this.height === 'string') {
          obj.height = this.height
        } else if (typeof this.height === 'number') {
          obj.height = `${this.height}px`
        }
        return obj
      }
    }
  }
</script>

<style>
  .nk-header{
    box-sizing: border-box;
  }
</style>
<!-- el-ui的写法： -->
<!-- <template>
  <header class="el-header" :style="{ height }">
    <slot></slot>
  </header>
</template>

<script>
  export default {
    name: 'ElHeader',

    componentName: 'ElHeader',

    props: {
      height: {
        type: String,
        default: '60px'
      }
    }
  };
</script>
 -->
