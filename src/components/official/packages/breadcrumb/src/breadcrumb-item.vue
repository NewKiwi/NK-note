<template>
  <span class="k-breadcrumb--item">
    <span class="k-breadcrumb--inner" @click="handleClick">
      <slot></slot>
    </span>
    <i v-if='seperatorClass' class='k-breadcrumb--seperator' :class="seperatorClass" :style='gutter'></i>
    <span v-else class='k-breadcrumb--seperator' :style='gutter'>{{seperator}}</span>
  </span>
</template>

<script>
export default {
  name: 'KBreadcrumbItem',

  inject: ['kBreadcrumb'],

  data() {
    return {
      seperator: '',
      seperatorClass: ''
    }
  },

  computed: {
    gutter() {
      const obj = {}
      obj.paddingLeft = `${this.kBreadcrumb.seperatorGutter}px`
      obj.paddingRight = obj.paddingLeft
      return obj
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    }
  },
  mounted() {
    this.seperator = this.kBreadcrumb.seperator
    this.seperatorClass = this.kBreadcrumb.seperatorClass
  }
}
</script>
