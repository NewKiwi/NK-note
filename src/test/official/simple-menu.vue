<template>
  <div>
    <k-simple-menu activeTextColor='#08A38E' default-active='1' router hover-transition>
      <k-simple-menu-item v-for="item in array1" :index='item.index' :key='item.index'>{{item.title}}</k-simple-menu-item>
    </k-simple-menu>
    <k-simple-menu mode='horizontal' borderColor='blue' text-color='red' activeTextColor='#08A38E' default-active='3' hover-transition>
      <k-simple-menu-item v-for="item in array1" :index='item.index' :key='item.index'>{{item.title}}</k-simple-menu-item>
    </k-simple-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      array1: [
        { index: '1', title: '222' },
        { index: '3', title: '226666' }
      ]
    }
  }
}
</script>

<style>

</style>
