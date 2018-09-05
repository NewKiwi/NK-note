<template>
  <div class="k-collapse-item" :class="{'is-active': isActive}">
    <div>
      <div
        class="k-collapse-item__header"
        @click="handleHeaderClick"
        :class="{
          'focusing': focusing,
          'is-active': isActive
        }"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <k-svg class="k-collapse-item__arrow" icon-class='icon-plus' v-show='!isActive' v-if='showIcon'></k-svg>
        <k-svg class="k-collapse-item__arrow" icon-class='icon-diff' v-show='isActive' v-if='showIcon'></k-svg>
        <slot name="title">{{title}}</slot>
      </div>
    </div>
    <k-collapse-transition>
      <div
        class="k-collapse-item__wrap"
        v-show="isActive"
      >
        <div class="k-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </k-collapse-transition>
  </div>
</template>
<script>
  import KCollapseTransition from '../../collapse-transition'
  import KSvg from '~/components/svg-icon'
  import Emitter from '../../../src/utils/mixins/emitter'

  export default {
    name: 'KCollapseItem',

    componentName: 'KCollapseItem',

    mixins: [Emitter],

    components: { KCollapseTransition, KSvg },

    data() {
      return {
        contentWrapStyle: {
          height: 'auto',
          display: 'block'
        },
        contentHeight: 0,
        focusing: false,
        isClick: false
      }
    },

    inject: ['collapse'],

    props: {
      title: String,
      name: {
        type: [String, Number],
        default() {
          return this._uid
        }
      },
      showIcon: {
        type: Boolean,
        default: true
      }
    },

    computed: {
      isActive() {
        return this.collapse.activeNames.indexOf(this.name) > -1
      }
    },

    methods: {
      handleFocus() {
        setTimeout(() => {
          if (!this.isClick) {
            this.focusing = true
          } else {
            this.isClick = false
          }
        }, 50)
      },
      handleHeaderClick() {
        this.dispatch('KCollapse', 'item-click', this)
        this.focusing = false
        this.isClick = true
      }
    }
  }
</script>

<style lang='scss'>
@import '../../../src/styles/_variable.scss';
.k-collapse-item{
  &__header{
    height: 64px;
    line-height: 64px;
    cursor: pointer;
    font-size: 20px;
    letter-spacing:2px;
  }
  &__arrow{
    color:$mainColor;
    font-size: 32px;
    margin-right:15px;
    line-height: 64px;
    vertical-align: top;
  }
}
</style>
