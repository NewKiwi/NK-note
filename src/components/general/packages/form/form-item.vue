<template>
  <div class="nk-form-item" :class="[{
      'el-form-item--feedback': elForm && elForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required
    },
    sizeClass ? 'el-form-item--' + sizeClass : '']">
    <label :for="labelFor" class="el-form-item__label" v-bind:style="labelStyle" v-if="label || $slots.label">
      <!-- {{}}slot默认值 -->
      <slot name="label">{{label + form.labelSuffix}}</slot>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'NkFormItem',

    componentName: 'NkFormItem',

    provide() {
      return {
        nkFormItem: this
      }
    },

    inject: ['nkForm']
  }
</script>
