<template>
  <span class="nk-breadcrumb__item">
    <span
      :class="['nk-breadcrumb__inner', to ? 'is-link' : '']"
      ref="link"
      role="link">
      <slot></slot>
    </span>
    <i v-if="separatorClass" class="nk-breadcrumb__separator" :class="separatorClass"></i>
    <span v-else class="nk-breadcrumb__separator" role="presentation">{{separator}}</span>
  </span>
</template>
<script>
  export default {
    name: 'NkBreadcrumbItem',
    props: {
      to: {},
      replace: Boolean
    },
    data() {
      return {
        separator: '',
        separatorClass: ''
      }
    },

    inject: ['nkBreadcrumb'],

    mounted() {
      this.separator = this.nkBreadcrumb.separator
      this.separatorClass = this.nkBreadcrumb.separatorClass
      if (this.to) {
        const link = this.$refs.link
        const to = this.to
        link.setAttribute('role', 'link')
        link.addEventListener('click', _ => {
          this.replace ? this.$router.replace(to)
            : this.$router.push(to)
        })
      }
    }
  }
</script>
