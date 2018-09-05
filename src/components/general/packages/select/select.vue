<template>
  <div
    class="nk-select"
    :class="[selectSize ? 'nk-select--' + selectSize : '']"
    @click.stop="toggleMenu"
    v-clickoutside="handleClose">
    <!-- 显示选中内容 -->
    <!-- readonly的判断 -->
    <nk-input
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :id="id"
      :auto-complete="autoComplete"
      :size="selectSize"
      :disabled="selectDisabled"
      :readonly="readonly"
      :validate-event="false"
      :class="{ 'is-focus': visible }"
      @focus="handleFocus"
      @blur="handleBlur"
      @keyup.native="debouncedOnInputChange"
      @keydown.native.down.stop.prevent="navigateOptions('next')"
      @keydown.native.up.stop.prevent="navigateOptions('prev')"
      @keydown.native.enter.prevent="selectOption"
      @keydown.native.esc.stop.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @paste.native="debouncedOnInputChange"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false">
      <i slot="suffix"
       :class="['nk-select__caret', 'nk-input__icon', 'nk-icon-' + iconClass]"
       @click="handleIconClick"
      ></i>
    </nk-input>
    <!-- 选择的内容 -->
    <transition
      name="nk-zoom-in-top"
      @before-enter="handleMenuEnter"
      @after-leave="doDestroy">
      <nk-select-menu
        ref="popper"
        :append-to-body="popperAppendToBody"
        v-show="visible && emptyText !== false">
        <nk-scrollbar
          tag="ul"
          wrap-class="nk-select-dropdown__wrap"
          view-class="nk-select-dropdown__list"
          ref="scrollbar"
          :class="{ 'is-empty': !allowCreate && query && filteredOptionsCount === 0 }"
          v-show="options.length > 0 && !loading">
          <nk-option
            :value="query"
            created
            v-if="showNewOption">
          </nk-option>
          <slot></slot>
        </nk-scrollbar>
        <p
          class="nk-select-dropdown__empty"
          v-if="emptyText &&
            (!allowCreate || loading || (allowCreate && options.length === 0 ))">
          {{ emptyText }}
        </p>
      </nk-select-menu>
    </transition>
  </div>
</template>

<script>
  import Emitter from '../../src/utils/emitter'
  import Focus from '../../src/utils/mixins/focus'
  import NkInput from '../input/input'
  import NkSelectMenu from './select-dropdown.vue'
  import NkOption from './option.vue'
  import NkTag from '../tag/tag'
  import NkScrollbar from '../scrollbar/main'
  // import { debounce } from 'throttle-debounce'
  import Clickoutside from '../../src/utils/directives/click-outside'
  // import { addClass, removeClass, hasClass } from '../../src/utils/dom'
  // import { addResizeListener, removeResizeListener } from '../../src/utils/resize-event'
  // import scrollIntoView from '../../src/utils/scroll-into-view'
  // import { valueEquals, getValueByPath } from '../../src/utils/util'
  import NavigationMixin from './navigation-mixin'
  // const sizeMap = {
  //   'medium': 36,
  //   'small': 32,
  //   'mini': 28
  // }

  export default {
    mixins: [Emitter, Focus('reference'), NavigationMixin],

    name: 'NkSelect',

    componentName: 'NkSelect',

    inject: {
      nkForm: {
        default: ''
      },

      nkFormItem: {
        default: ''
      }
    },

    provide() {
      return {
        'select': this
      }
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize
      },

      readonly() {
        // trade-off for IE input readonly problem: https://github.com/ElemeFE/element/issues/10403
        const isIE = !this.$isServer && !isNaN(Number(document.documentMode))
        return !this.filterable || this.multiple || (!isIE && !this.visible)
      },

      iconClass() {
        const criteria = this.clearable &&
          !this.selectDisabled &&
          this.inputHovering &&
          !this.multiple &&
          this.value !== undefined &&
          this.value !== ''
        return criteria ? 'circle-close is-show-close' : (this.remote && this.filterable ? '' : 'arrow-up')
      },

      debounce() {
        return this.remote ? 300 : 0
      },

      emptyText() {
        if (this.loading) {
          return this.loadingText || '加载中'
        } else {
          if (this.remote && this.query === '' && this.options.length === 0) return false
          if (this.filterable && this.query && this.options.length > 0 && this.filteredOptionsCount === 0) {
            return this.noMatchText || '无匹配内容'
          }
          if (this.options.length === 0) {
            return this.noDataText || '无数据'
          }
        }
        return null
      },

      showNewOption() {
        const hasExistingOption = this.options.filter(option => !option.created)
          .some(option => option.currentLabel === this.query)
        return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption
      },

      selectSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
      },

      selectDisabled() {
        return this.disabled || (this.elForm || {}).disabled
      },

      collapseTagSize() {
        return ['small', 'mini'].indexOf(this.selectSize) > -1
          ? 'mini'
          : 'small'
      }
    },

    components: {
      NkInput,
      NkSelectMenu,
      NkOption,
      NkTag,
      NkScrollbar
    },

    directives: { Clickoutside },

    props: {
      name: String,
      id: String,
      value: {
        required: true
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      automaticDropdown: Boolean,
      size: String,
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      allowCreate: Boolean,
      loading: Boolean,
      popperClass: String,
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      remoteMethod: Function,
      filterMethod: Function,
      multiple: Boolean,
      multipleLimit: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String,
        default() {
          return '请选择'
        }
      },
      defaultFirstOption: Boolean,
      reserveKeyword: Boolean,
      valueKey: {
        type: String,
        default: 'value'
      },
      collapseTags: Boolean,
      popperAppendToBody: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        options: [],
        cachedOptions: [],
        createdLabel: null,
        createdSelected: false,
        selected: this.multiple ? [] : {},
        inputLength: 20,
        inputWidth: 0,
        cachedPlaceHolder: '',
        optionsCount: 0,
        filteredOptionsCount: 0,
        visible: false,
        softFocus: false,
        selectedLabel: '',
        hoverIndex: -1,
        query: '',
        previousQuery: null,
        inputHovering: false,
        currentPlaceholder: '',
        menuVisibleOnFocus: false,
        isOnComposition: false,
        isSilentBlur: false
      }
    },

    watch: {
      selectDisabled() {
        this.$nextTick(() => {
          this.resetInputHeight()
        })
      },

      placeholder(val) {
        this.cachedPlaceHolder = this.currentPlaceholder = val
      },

      value(val) {
        if (this.multiple) {
          this.resetInputHeight()
          if (val.length > 0 || (this.$refs.input && this.query !== '')) {
            this.currentPlaceholder = ''
          } else {
            this.currentPlaceholder = this.cachedPlaceHolder
          }
          if (this.filterable && !this.reserveKeyword) {
            this.query = ''
            this.handleQueryChange(this.query)
          }
        }
        this.setSelected()
        if (this.filterable && !this.multiple) {
          this.inputLength = 20
        }
      },

      visible(val) {
        if (!val) {
          this.handleIconHide()
          this.broadcast('NkSelectDropdown', 'destroyPopper')
          if (this.$refs.input) {
            this.$refs.input.blur()
          }
          this.query = ''
          this.previousQuery = null
          this.selectedLabel = ''
          this.inputLength = 20
          this.resetHoverIndex()
          this.$nextTick(() => {
            if (this.$refs.input &&
              this.$refs.input.value === '' &&
              this.selected.length === 0) {
              this.currentPlaceholder = this.cachedPlaceHolder
            }
          })
          if (!this.multiple) {
            if (this.selected) {
              if (this.filterable && this.allowCreate &&
                this.createdSelected && this.createdLabel) {
                this.selectedLabel = this.createdLabel
              } else {
                this.selectedLabel = this.selected.currentLabel
              }
              if (this.filterable) this.query = this.selectedLabel
            }
          }
        } else {
          this.handleIconShow()
          this.broadcast('NkSelectDropdown', 'updatePopper')
          if (this.filterable) {
            this.query = this.remote ? '' : this.selectedLabel
            this.handleQueryChange(this.query)
            if (this.multiple) {
              this.$refs.input.focus()
            } else {
              if (!this.remote) {
                this.broadcast('NkOption', 'queryChange', '')
                this.broadcast('NkOptionGroup', 'queryChange')
              }
              this.broadcast('NkInput', 'inputSelect')
            }
          }
        }
        this.$emit('visible-change', val)
      },

      options() {
        if (this.$isServer) return
        this.$nextTick(() => {
          this.broadcast('NkSelectDropdown', 'updatePopper')
        })
        if (this.multiple) {
          this.resetInputHeight()
        }
        const inputs = this.$el.querySelectorAll('input')
        if ([].indexOf.call(inputs, document.activeElement) === -1) {
          this.setSelected()
        }
        if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
          this.checkDefaultFirstOption()
        }
      }
    }
  }
</script>
