<template>
  <div
    class="nk-switch"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click="switchValue"
  >
    <input
      class="nk-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue"
    >
    <span
      :class="['nk-switch__label', 'nk-switch__label--left', !checked ? 'is-active' : '']"
      v-if="inactiveIconClass || inactiveText">
      <i :class="[inactiveIconClass]" v-if="inactiveIconClass"></i>
      <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{ inactiveText }}</span>
    </span>
    <span class="nk-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }">
    </span>
    <span
      :class="['nk-switch__label', 'nk-switch__label--right', checked ? 'is-active' : '']"
      v-if="activeIconClass || activeText">
      <i :class="[activeIconClass]" v-if="activeIconClass"></i>
      <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{ activeText }}</span>
    </span>
  </div>
</template>
<script>
  import Focus from '../../src/utils/mixins/focus'

  export default {
    name: 'NkSwitch',
    mixins: [Focus('input')],
    inject: {
      nkForm: {
        default: ''
      }
    },
    props: {
      value: {
        type: [Boolean, String, Number],
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 40
      },
      activeIconClass: {
        type: String,
        default: ''
      },
      inactiveIconClass: {
        type: String,
        default: ''
      },
      activeText: String,
      inactiveText: String,
      activeColor: {
        type: String,
        default: ''
      },
      inactiveColor: {
        type: String,
        default: ''
      },
      activeValue: {
        type: [Boolean, String, Number],
        default: true
      },
      inactiveValue: {
        type: [Boolean, String, Number],
        default: false
      },
      name: {
        type: String,
        default: ''
      },
      id: String
    },
    data() {
      return {
        coreWidth: this.width
      }
    },
    created() {
      if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
        this.$emit('input', this.inactiveValue)
      }
    },
    computed: {
      checked() {
        return this.value === this.activeValue
      },
      switchDisabled() {
        return this.disabled || (this.elForm || {}).disabled
      }
    },
    watch: {
      checked() {
        this.$refs.input.checked = this.checked
        if (this.activeColor || this.inactiveColor) {
          this.setBackgroundColor()
        }
      }
    },
    methods: {
      handleChange(event) {
        this.$emit('input', !this.checked ? this.activeValue : this.inactiveValue)
        this.$emit('change', !this.checked ? this.activeValue : this.inactiveValue)
        this.$nextTick(() => {
          // set input's checked property
          // in case parent refuses to change component's value
          this.$refs.input.checked = this.checked
        })
      },
      setBackgroundColor() {
        const newColor = this.checked ? this.activeColor : this.inactiveColor
        this.$refs.core.style.borderColor = newColor
        this.$refs.core.style.backgroundColor = newColor
      },
      switchValue() {
        !this.switchDisabled && this.handleChange()
      }
    },
    mounted() {
      /* istanbul ignore if */
      this.coreWidth = this.width || 40
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor()
      }
      this.$refs.input.checked = this.checked
    }
  }
</script>
