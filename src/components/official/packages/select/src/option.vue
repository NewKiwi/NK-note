<template>
  <li
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    class="k-select-dropdown__item"
    v-show="visible"
    :class="{
      'selected': itemSelected,
      'is-disabled': disabled,
      'hover': hover
    }">
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script>
  import Emitter from '../../../src/utils/mixins/emitter.js'
  import { getValueByPath } from '../../../src/utils/util'

  export default {
    mixins: [Emitter],

    name: 'KOption',

    componentName: 'KOption',

    inject: ['KSelect'],

    props: {
      value: {
        required: true
      },
      label: [String, Number],
      created: Boolean,
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        index: -1,
        visible: true,
        hitState: false,
        hover: false
      }
    },

    computed: {
      isObject() {
        return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]'
      },

      currentLabel() {
        return this.label || (this.isObject ? '' : this.value)
      },

      currentValue() {
        return this.value || this.label || ''
      },

      itemSelected() {
        return this.isEqual(this.value, this.KSelect.value)
      }
    },

    watch: {
      currentLabel() {
        if (!this.created) this.dispatch('KSelect', 'setSelected')
      },
      value() {
        if (!this.created) this.dispatch('KSelect', 'setSelected')
      }
    },

    methods: {
      isEqual(a, b) {
        if (!this.isObject) {
          return a === b
        } else {
          const valueKey = this.KSelect.valueKey
          return getValueByPath(a, valueKey) === getValueByPath(b, valueKey)
        }
      },

      hoverItem() {
        if (!this.disabled) {
          this.KSelect.hoverIndex = this.KSelect.options.indexOf(this)
        }
      },

      selectOptionClick() {
        if (this.disabled !== true) {
          this.dispatch('KSelect', 'handleOptionClick', [this, true])
        }
      }
    },

    created() {
      this.KSelect.options.push(this)
      this.KSelect.cachedOptions.push(this)
      this.KSelect.optionsCount++
    },

    beforeDestroy() {
      this.KSelect.onOptionDestroy(this.KSelect.options.indexOf(this))
    }
  }
</script>
