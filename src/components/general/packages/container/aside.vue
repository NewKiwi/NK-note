<template>
  <aside class="nk-aside" :style='style'>
    <slot></slot>
  </aside>
</template>

<script>
  export default {
    name: 'NkAside',

    componentName: 'NkAside',

    props: {
      width: {
        type: [String, Number],
        default: '300px'
      }
    },

    computed: {
      style() {
        const obj = {}
        if (typeof this.width === 'string') {
          obj.width = this.width
        } else if (typeof this.width === 'number') {
          obj.width = `${this.width}px`
        }
        return obj
      }
    }
  }
</script>

<style>
  .nk-aside{
    box-sizing: border-box;
    overflow: auto;
  }
</style>

<!-- <template>
  <aside class="el-aside" :style="{ width }">
    <slot></slot>
  </aside>
</template>

<script>
  export default {
    name: 'ElAside',

    componentName: 'ElAside',

    props: {
      width: {
        type: String,
        default: '300px'
      }
    }
  };
</script> -->
