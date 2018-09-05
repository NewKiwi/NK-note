<template>
  <div class="test" @scroll='testScroll'>
    <nk-button class="test-loading--btn" type='text' @click='changeLoadingInData'>测试loading的值变化</nk-button>
    <nk-button class="test-loading--unbind" type='text' @click='testLoadingUnbind'>测试loading的unbind</nk-button>
    <div v-loading.body='loading' element-loading-text='测试自定义指令' element-loading-background='rgba(0, 0, 0, .8)' element-loading-custom-class='test-loading test-loading-class'>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false
      }
    },
    methods: {
      changeLoadingInData() {
        this.loading = !this.loading
      },
      testLoadingUnbind(e) {
        // 如何触发指令的unbind? 如何移除指令？通过移除DOM吗
      },
      testScroll(e) {
        console.log(e)
      }
    }
  }
</script>

<style lang="scss">
  .test{
    width:100%;
    height:100%;
  }
  .test-loading{
    min-height:60px;
  }
  .test-loading--btn{
    position:fixed;
    top:0;
    left:0;
    z-index:9999;
  }
  .test-loading--unbind{
    position:fixed;
    top:60px;
    left:0;
    z-index:9999;
  }
</style>
