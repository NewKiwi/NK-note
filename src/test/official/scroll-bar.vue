<template>
  <div class="test-scrollbar">
    <k-scrollbar class="scroll-bar--height" @barScroll='fetchScrollValue'>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
      <div class='text'>23412341241</div>
    </k-scrollbar>
  </div>
</template>

<script>
export default {
  methods: {
    fetchScrollValue(data) {
      console.log(data)
    }
  }
}
</script>

<style lang='scss'>
.test-scrollbar{
  width: 100%;
  height: 100%;
  .text{
    font-size: 30px;
  }
  .scroll-bar--height{
    height: 100%;
  }
}
</style>

