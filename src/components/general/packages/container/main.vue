<template>
  <main class="nk-main">
    <slot></slot>
  </main>
</template>

<script>
  export default {
    name: 'NkMain',
    componentName: 'NkMain'
  }
</script>

<style>
  .nk-main{
    flex:1;
    overflow: auto;
  }
</style>
