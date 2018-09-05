<template>
  <nk-button type="primary" @click='showMessage'>测试message和PopupManager</nk-button>
</template>

<script>
  export default {
    methods: {
      showMessage() {
        this.$message({
          type: 'success',
          message: '测试message和PopupManager'
        })
      }
    }
  }
</script>
