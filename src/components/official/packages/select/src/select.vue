<template>
  <div
    class="k-select"
    @click.stop="toggleMenu"
    v-clickoutside="handleClose">
    <k-input
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :id="id"
      :size='inputSize'
      :auto-complete="autoComplete"
      :disabled="selectDisabled"
      :readonly='readonly'
      :validate-event="false"
      :class="{ 'is-focus': visible }"
      @focus="handleFocus"
      @blur="handleBlur">
      <i slot="suffix"
       :class="['k-select__caret', 'k-input__icon', 'k-icon-' + iconClass]"></i>
    </k-input>
    <transition
      name="k-zoom-in-top"
      @before-enter="handleMenuEnter"
      @after-leave="doDestroy">
      <k-select-menu
        ref="popper"
        :append-to-body="popperAppendToBody"
        v-show="visible">
        <k-scrollbar
          tag="ul"
          container-class="k-select-dropdown__wrap"
          view-class="k-select-dropdown__list"
          ref="scrollbar"
          v-show="options.length > 0">
          <slot></slot>
        </k-scrollbar>
        <p
          class="k-select-dropdown__empty"
          v-if="emptyText && options.length === 0">
          {{ emptyText }}
        </p>
      </k-select-menu>
    </transition>
  </div>
</template>

<script>
import Emitter from '../../../src/utils/mixins/emitter'
import KInput from '../../input'
import KSelectMenu from './select-dropdown.vue'
import KOption from './option.vue'
import KScrollbar from '../../scroll-bar'
import Clickoutside from '../../../src/utils/click-outside'
import { valueEquals, getValueByPath } from '../../../src/utils/util'
import scrollIntoView from '../../../src/utils/scroll-into-view'
import { addClass, removeClass } from '../../../src/utils/dom'
export default {
  name: 'KSelect',

  componentName: 'KSelect',
  components: {
    KInput,
    KSelectMenu,
    KOption,
    KScrollbar
  },
  mixins: [Emitter],
  directives: { Clickoutside },
  inject: {
    KForm: {
      default: ''
    },

    KFormItem: {
      default: ''
    }
  },
  data() {
    return {
      options: [],
      createdLabel: null,
      createdSelected: false,
      cachedOptions: [],
      currentPlaceholder: '',
      visible: false,
      selectedLabel: '',
      selected: {},
      hoverIndex: -1,
      menuVisibleOnFocus: false,
      softFocus: false,
      isSilentBlur: false,
      inputWidth: 0
    }
  },
  provide() {
    return {
      'KSelect': this
    }
  },
  props: {
    noDataText: {
      type: String,
      default: '无数据'
    },
    inputSize: String,
    name: String,
    id: String,
    value: {
      required: true
    },
    iconClass: {
      type: String,
      default: 'arrow-up'
    },
    filterable: Boolean,
    autoComplete: {
      type: String,
      default: 'off'
    },
    disabled: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    popperClass: String,
    valueKey: {
      type: String,
      default: 'value'
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  computed: {
    readonly() {
      const isIE = !this.$isServer && !isNaN(Number(document.documentMode))
      return !this.filterable || (!isIE && !this.visible)
    },
    emptyText() {
      return this.noDataText
    },
    selectDisabled() {
      return this.disabled || (this.KForm || {}).disabled
    }
  },
  watch: {
    placeholder(val) {
      this.currentPlaceholder = val
    },
    value(val) {
      this.setSelected()
    },
    visible(val) {
      if (!val) {
        this.handleIconHide()
        this.broadcast('KSelectDropdown', 'destroyPopper')
        if (this.$refs.input) {
          this.$refs.input.blur()
        }
        this.selectedLabel = ''
        this.resetHoverIndex()
        if (this.selected) {
          this.selectedLabel = this.selected.currentLabel
        }
      } else {
        this.handleIconShow()
        this.broadcast('KSelectDropdown', 'updatePopper')
      }
      this.$emit('visible-change', val)
    }
  },
  methods: {
    toggleMenu() {
      if (!this.selectDisabled) {
        if (this.menuVisibleOnFocus) {
          this.menuVisibleOnFocus = false
        } else {
          this.visible = !this.visible
        }
        if (this.visible) {
          (this.$refs.input || this.$refs.reference).focus()
        }
      }
    },
    onOptionDestroy(index) {
      if (index > -1) {
        this.optionsCount--
        this.options.splice(index, 1)
      }
    },
    handleClose() {
      this.visible = false
    },
    handleFocus(event) {
      if (!this.softFocus) {
        if (this.automaticDropdown) {
          this.visible = true
          this.menuVisibleOnFocus = true
        }
        this.$emit('focus', event)
      } else {
        this.softFocus = false
      }
    },
    handleBlur(event) {
      setTimeout(() => {
        if (this.isSilentBlur) {
          this.isSilentBlur = false
        } else {
          this.$emit('blur', event)
        }
      }, 50)
      this.softFocus = false
    },
    handleIconHide() {
      const icon = this.$el.querySelector('.k-input__icon')
      if (icon) {
        removeClass(icon, 'is-reverse')
      }
    },

    handleIconShow() {
      const icon = this.$el.querySelector('.k-input__icon')
      if (icon) {
        addClass(icon, 'is-reverse')
      }
    },
    resetHoverIndex() {
      setTimeout(() => {
        this.hoverIndex = this.options.indexOf(this.selected)
      }, 300)
    },
    emitChange(val) {
      if (!valueEquals(this.value, val)) {
        this.$emit('change', val)
        this.dispatch('KFormItem', 'k.form.change', val)
      }
    },
    setSoftFocus() {
      this.softFocus = true
      const input = this.$refs.input || this.$refs.reference
      if (input) {
        input.focus()
      }
    },
    scrollToOption(option) {
      const target = Array.isArray(option) && option[0] ? option[0].$el : option.$el
      if (this.$refs.popper && target) {
        const menu = this.$refs.popper.$el.querySelector('.k-select-dropdown__wrap')
        scrollIntoView(menu, target)
      }
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll()
    },
    handleOptionSelect(option, byClick) {
      this.$emit('input', option.value)
      this.emitChange(option.value)
      this.visible = false
      this.isSilentBlur = byClick
      this.setSoftFocus()
      if (this.visible) return
      this.$nextTick(() => {
        this.scrollToOption(option)
      })
    },
    handleMenuEnter() {
      this.$nextTick(() => this.scrollToOption(this.selected))
    },
    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy()
    },
    getOption(value) {
      let option
      const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]'
      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i]
        const isEqual = isObject
          ? getValueByPath(cachedOption.value, this.valueKey) === getValueByPath(value, this.valueKey)
          : cachedOption.value === value
        if (isEqual) {
          option = cachedOption
          break
        }
      }
      if (option) return option
      const label = !isObject
        ? value : ''
      const newOption = {
        value: value,
        currentLabel: label
      }
      return newOption
    },
    setSelected() {
      // if (!this.multiple) {
        const option = this.getOption(this.value)
        if (option.created) {
          this.createdLabel = option.currentLabel
          this.createdSelected = true
        } else {
          this.createdSelected = false
        }
        this.selectedLabel = option.currentLabel
        this.selected = option
      //   return;
      // }
      // let result = [];
      // if (Array.isArray(this.value)) {
      //   this.value.forEach(value => {
      //     result.push(this.getOption(value));
      //   });
      // }
      // this.selected = result;
      // this.$nextTick(() => {
      //   this.resetInputHeight();
      // });
    }
  },
  created() {
    this.$on('handleOptionClick', this.handleOptionSelect)
    this.$on('setSelected', this.setSelected)
    this.$on('fieldReset', () => {
      this.dispatch('KFormItem', 'k.form.change')
    })
  },
  mounted() {
    // console.log(this.value)
    this.$nextTick(() => {
      if (this.$refs.reference && this.$refs.reference.$el) {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
      }
    })
    this.setSelected()
  }
}
</script>

<style lang='scss'>
@import '~/assets/styles/_variable.scss';
.k-select-dropdown {
    position: absolute;
    z-index: 1001;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 5px 0
}
.k-select-dropdown.k-popper.k-popover{
  padding:0;
  overflow: hidden;
}

.k-select-dropdown__empty {
    padding: 10px 0;
    margin: 0;
    text-align: center;
    color: #999;
    font-size: 14px
}

.k-select-dropdown__wrap {
    max-height: 274px
}

.k-select-dropdown__list {
    list-style: none;
    padding: 6px 0;
    margin: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box
}
.k-select-dropdown .k-scrollbar.is-empty .k-select-dropdown__list {
    padding: 0
}

.k-select-dropdown__item {
    font-size: 14px;
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 34px;
    line-height: 34px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer
}

.k-select-dropdown__item.is-disabled {
    color: #c0c4cc;
    cursor: not-allowed
}

.k-select-dropdown__item.is-disabled:hover {
    background-color: #fff
}

.k-select-dropdown__item.hover,
.k-select-dropdown__item:hover {
    background-color: #f5f7fa
}

.k-select-dropdown__item.selected {
    color: #409EFF;
    font-weight: 700
}

.k-select-dropdown__item span {
    line-height: 34px!important
}
.k-select {
    display: inline-block;
    position: relative
}

.k-select:hover .k-input__inner {
    border-color: #c0c4cc;
}

.k-select .k-input__inner {
    cursor: pointer;
    padding-right: 35px
}

.k-select .k-input__inner:focus {
    border-color: $mainColor;
}

.k-select .k-input .k-select__caret {
    color: #c0c4cc;
    font-size: 14px;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    -webkit-transform: rotateZ(180deg);
    transform: rotateZ(180deg);
    line-height: 16px;
    cursor: pointer
}

.k-select .k-input .k-select__caret.is-reverse {
    -webkit-transform: rotateZ(0);
    transform: rotateZ(0)
}

.k-select .k-input.is-disabled .k-input__inner {
    cursor: not-allowed
}

.k-select .k-input.is-disabled .k-input__inner:hover {
    border-color: #e4e7ed
}

.k-select .k-input.is-focus .k-input__inner {
    border-color:$mainColor;
}

.k-select>.k-input {
    display: block
}

.k-select__input {
    border: none;
    outline: 0;
    padding: 0;
    margin-left: 15px;
    color: #666;
    font-size: 14px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    height: 28px;
    background-color: transparent
}
</style>
