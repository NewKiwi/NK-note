<template>
  <div class="nk-collapse-item" :class="{'is-active': isActive}">
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="`nk-collapse-content-${id}`"
      :aria-describedby ="`nk-collapse-content-${id}`"
    >
      <div
        class="nk-collapse-item__header"
        @click="handleHeaderClick"
        role="button"
        :id="`nk-collapse-head-${id}`"
        tabindex="0"
        @keyup.space.enter.stop="handleEnterClick"
        :class="{
          'focusing': focusing,
          'is-active': isActive
        }"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <i
          class="nk-collapse-item__arrow nk-icon-arrow-right"
          :class="{'is-active': isActive}">
        </i>
        <slot name="title">{{title}}</slot>
      </div>
    </div>
    <nk-collapse-transition>
      <div
        class="nk-collapse-item__wrap"
        v-show="isActive"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="`nk-collapse-head-${id}`"
        :id="`nk-collapse-content-${id}`"
      >
        <div class="nk-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </nk-collapse-transition>
  </div>
</template>
<script>
  import NkCollapseTransition from '../../src/transitions/collapse-transition'
  import Emitter from '../../src/utils/emitter'
  import { generateId } from '../../src/utils/util'

  export default {
    name: 'NkCollapseItem',

    componentName: 'NkCollapseItem',

    mixins: [Emitter],

    components: { NkCollapseTransition },

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
      }
    },

    computed: {
      isActive() {
        return this.collapse.activeNames.indexOf(this.name) > -1
      },
      id() {
        return generateId()
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
        this.dispatch('NkCollapse', 'item-click', this)
        this.focusing = false
        this.isClick = true
      },
      handleEnterClick() {
        this.dispatch('NkCollapse', 'item-click', this)
      }
    }
  }
</script>
