<template>
  <footer class="nk-footer" :style='style'>
    <slot></slot>
  </footer>
</template>

<script>
  export default {
    name: 'NkFooter',

    componentName: 'NkFooter',

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
  .nk-footer{
    box-sizing:border-box;
  }
</style>

<!-- <template>
  <footer class="el-footer" :style="{ height }">
    <slot></slot>
  </footer>
</template>

<script>
  export default {
    name: 'ElFooter',

    componentName: 'ElFooter',

    props: {
      height: {
        type: String,
        default: '60px'
      }
    }
  };
</script> -->
