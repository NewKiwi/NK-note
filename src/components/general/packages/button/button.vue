<!--
  class 数组中含对象
  slot  我写的只有slot， element-ui是这个：<span v-if="$slots.default"><slot></slot></span> ？这是保证里面的文字内容用span标签包住，使样式能自动调整？
-->

<template>
  <button
    class="nk-button"
    @click='handleClick'
    :type='nativeType'
    :autofocus='autofocus'
    :class="[
      type ? 'nk-button' + type : '',
      size ? 'nk-button' + size : '',
      {
        'is-plain': plain,
        'is-circle': circle,
        'is-round': round,
        'is-disabled': disabled || loading
      }
    ]"
  >
    <i :class='icon' v-if='icon && !loading'></i>
    <i class='nk-icon-loading' v-if='loading'></i>
    <span v-if="$slots.default"><slot></slot></span>
   <!--  <slot></slot> -->
  </button>
</template>

<script>
  export default {
    name: 'NkButton',

    props: {
      size: String,
      type: {
        type: String,
        default: 'default'
      },
      plain: Boolean,
      circle: Boolean,
      round: Boolean,
      disabled: Boolean,
      autofocus: Boolean,
      loading: Boolean,
      icon: String,
      nativeType: {
        type: String,
        default: 'button'
      }
    },

    methods: {
      handleClick(e) {
        this.$emit('click', e)
      }
    }
  }
</script>
<!-- element-ui中props的icon不同，有默认的''值，自己写的是否有其他影响？ -->
<!-- element-ui中不同，因为有表单 -->
