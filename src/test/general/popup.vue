<template>
  <div id="popup">
    <nk-button type="text" @click='reference' class='popup'>测试modal的引用</nk-button>
    <nk-button type="text" @click='deleteReference' class='popup'>测试modal的删除</nk-button>
    <nk-button type="text" @click='testAddMoreDom' class='popup'>测试modal的增加</nk-button>
    <nk-button type="text" @click='testChangingDomStyle' class='popup'>测试modal的样式改变</nk-button>
  </div>
</template>

<script>
  import { PopupManager } from '@/components/general/src/utils/popup'
  export default {
    methods: {
      reference() {
        PopupManager.testDomReference()
      },
      deleteReference() {
        PopupManager.testDeleteDom()
      },
      testAddMoreDom() {
        PopupManager.openModal(2, 1001)
        // 没有增加？是因为替换了？
        console.log(PopupManager.modalDom)
      },
      testChangingDomStyle() {
        PopupManager.modalDom.style.backgroundColor = 'blue'
      }
    },
    created() {
      console.log(PopupManager)
      PopupManager.openModal(1, 1000)
    }
  }
</script>

<style>
  .popup{
    position: fixed;
    z-index: 9999;
  }
  .popup:nth-child(2) {
    top:80px;
  }
  .popup:nth-child(3) {
    top:150px;
  }
  .popup:nth-child(4) {
    top:200px;
  }
</style>
