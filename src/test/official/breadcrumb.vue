<template>
  <div class="test-breadcrumb">
    <k-breadcrumb>
      <k-breadcrumb-item v-for="item in amount" :key="item">{{item}}</k-breadcrumb-item>
    </k-breadcrumb>
    <k-breadcrumb :seperator='seperator'>
      <k-breadcrumb-item v-for="item in amount" :key="item">{{item}}</k-breadcrumb-item>
    </k-breadcrumb>
    <k-breadcrumb seperator-class='k-icon-arrow-right'>
      <k-breadcrumb-item v-for="item in amount" :key="item">{{item}}</k-breadcrumb-item>
    </k-breadcrumb>
    <k-button @click='changeSeperator'>测试provide this是否响应</k-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      amount: 6,
      seperator: '...'
    }
  },

  methods: {
    changeSeperator() {
      this.seperator = '|'
      console.log(this.seperator)
    }
  }
}
</script>
