<template>
  <div class="test-official-carousel">
    <k-carousel height='200px' direction='horizontal' @change='isActive'>
      <k-carousel-item>1111</k-carousel-item>
      <k-carousel-item>1111</k-carousel-item>
    </k-carousel>
    <k-carousel height='200px' direction='vertical' @change='isActive' style="margin-top:60px">
      <k-carousel-item>1111</k-carousel-item>
      <k-carousel-item>1111</k-carousel-item>
    </k-carousel>
    <k-carousel height='200px' direction='vertical' type='pane' @change='isActive' style="margin-top:60px">
      <k-carousel-item>1111</k-carousel-item>
      <k-carousel-item>1111</k-carousel-item>
      <k-carousel-item>1111</k-carousel-item>
    </k-carousel>
    <k-carousel height='200px' direction='horizontal' type='pane' @change='isActive' style="margin-top:60px">
      <k-carousel-item>1111</k-carousel-item>
      <k-carousel-item>1111</k-carousel-item>
      <k-carousel-item>1111</k-carousel-item>
    </k-carousel>
  </div>
</template>

<script>
export default {
  methods: {
    isActive({val, oldVal}) {
      // console.log(val, oldVal)
    }
  }
}
</script>

<style>
.k-carousel__item {
  background-color:aqua;
}
</style>
