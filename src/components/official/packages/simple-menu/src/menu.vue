<template>
  <div
    class="k-simple-menu"
    :style="{ background: backgroundColor }"
    :class="{
      'no-border': noBorder,
      'k-simple-menu--horizontal': mode === 'horizontal'
    }">
    <div v-if="$slots.prepend" class="k-simple-menu__prepend">
      <slot name='prepend'></slot>
    </div>
    <ul class="k-simple-menu__list">
      <slot></slot>
    </ul>
    <div v-if="$slots.append" class="k-simple-menu__append">
      <slot name='append'></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KSimpleMenu',
  componentName: 'KSimpleMenu',
  provide() {
    return {
      simpleMenu: this
    }
  },

  props: {
    defaultActive: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    noBorder: Boolean,
    textColor: String,
    activeTextColor: String,
    borderColor: {
      type: String,
      default: '#08A38E'
    },
    mode: {
      type: String,
      default: 'vertical'
    },
    router: Boolean,
    hoverTransition: Boolean
  },

  data() {
    return {
      items: {},
      activeIndex: this.defaultActive
    }
  },

  watch: {
    defaultActive: 'updateActiveIndex'
  },
  methods: {
    addItem(item) {
      this.$set(this.items, item.index, item)
    },
    removeItem(item) {
      delete this.items[item.index]
    },
    updateActiveIndex() {
      const item = this.items[this.defaultActive]
      if (item) {
        this.activeIndex = item.index
      } else {
        this.activeIndex = null
      }
    },
    handleItemClick(item) {
      const { index } = item
      const oldActiveIndex = this.activeIndex
      this.$emit('click-item', index)
      this.activeIndex = index
      if (this.router) {
        this.routeToItem(item, (error) => {
          this.activeIndex = oldActiveIndex
          if (error) console.error(error)
        })
      }
    },
    routeToItem(item, onError) {
      const route = item.route || item.index
      try {
        this.$router.push(route, () => {}, onError)
      } catch (e) {
        console.error(e)
      }
    }
  },
  mounted() {
    this.$on('item-click', this.handleItemClick)
    this.$watch('items', this.updateActiveIndex)
  }
}
</script>

<style lang='scss'>
@import '../../../src/styles/_variable.scss';
.k-simple-menu{
  background-color: #fff;
  border-right: solid 1px #e6e6e6;
  position: relative;
  &__list{
    position: relative;
    margin: 0;
    padding-left: 0;
    display: inline-block;
  }
  &__list:before, &__list:after{
    content: '';
    display: table;
    clear: both;
  }
  &--horizontal{
    border-right: none;
    border-bottom: solid 1px #e6e6e6
  }
  &--horizontal.no-border{
    border-bottom: none;
  }
  &--horizontal .k-simple-menu__item{
    float: left;
    height: 60px;
    line-height: 60px;
    margin: 0;
    border-bottom: 2px solid rgb(155, 155, 155);
    color:$mainText;
  }
  &--horizontal .k-simple-menu__item a,
  &--horizontal .k-simple-menu__item a:hover{
    color:inherit;
  }
  &--horizontal .k-simple-menu__item.is-active{
    border-bottom: 2px solid $mainColor;
    color:$mainColor;
  }
  &--horizontal .k-simple-menu__item .is-hover-bar{
    position: absolute;
    height: 2px;
    width: 0;
    bottom: -2px;
    left:0;
    top:auto;
    right:auto;
  }
  &__prepend, &__append{
    display: inline-block;
  }
}
.k-simple-menu__item{
  font-size: 14px;
  color:$mainText;
  padding: 0 20px;
  cursor: pointer;
  -webkit-transition: border-color .3s, background-color .3s, color .3s;
  transition: border-color .3s, background-color .3s, color .3s;
  box-sizing: border-box;
  height: 56px;
  line-height: 56px;
  position: relative;
  -webkit-box-sizing: border-box;
  white-space: nowrap;
  list-style: none;
  &.is-active{
    color:$mainColor;
  }
  & .is-hover-bar{
    transition: all .3s linear;
    position: absolute;
    width: 2px;
    top: 0;
    right:-2px;
    height: 0;
  }
}
.k-simple-menu__item * {
  vertical-align: middle;
}
</style>
