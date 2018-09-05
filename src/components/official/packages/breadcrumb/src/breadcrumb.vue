<template>
  <div class="k-breadcrumb">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'KBreadcrumb',

  provide() {
    return {
      'kBreadcrumb': this
    }
  },

  props: {
    seperator: {
      type: String,
      default: '/'
    },
    seperatorClass: {
      type: String,
      default: ''
    },
    seperatorGutter: {
      type: Number,
      default: 10
    }
  }
}
</script>

<style lang="scss">
@import '../../../src/styles/_variable.scss';
.k-breadcrumb{
  color: $mainText;
  font-size: 14px;
  &--inner{
    cursor: pointer;
  }
  &--item:last-child &--seperator{
    display: none;
  }
}
</style>
