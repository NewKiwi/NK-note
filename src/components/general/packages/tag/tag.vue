<template>
  <transition :name="disableTransitions ? '' : 'nk-zoom-in-center'">
    <span
      class="nk-tag"
      :class="[
        type ? 'nk-tag--' + type : '',
        tagSize && `nk-tag--${tagSize}`,
        {'is-hit': hit}
      ]"
      :style="{backgroundColor: color}">
      <slot></slot>
      <i class="nk-tag__close nk-icon-close"
        v-if="closable"
        @click.stop="handleClose"></i>
    </span>
  </transition>
</template>
<script>
  export default {
    name: 'NkTag',
    props: {
      text: String,
      closable: Boolean,
      type: String,
      hit: Boolean,
      disableTransitions: Boolean,
      color: String,
      size: String
    },
    methods: {
      handleClose(event) {
        this.$emit('close', event)
      }
    },
    computed: {
      tagSize() {
        return this.size || (this.$ELEMENT || {}).size
      }
    }
  }
</script>
