<template>
  <i :class="[nk-icon, 'nk-icon-' + name]"></i>
</template>

<script>
  export default {
    name: 'ElIcon',

    props: {
      name: String
    }
  }
</script>
