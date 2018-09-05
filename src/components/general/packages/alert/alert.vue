<template>
  <transition name="nk-alert-fade">
    <div
      class="nk-alert"
      :class="[typeClass, center ? 'is-center' : '']"
      v-show="visible"
      role="alert"
    >
      <i class="nk-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
      <div class="nk-alert__content">
        <span class="nk-alert__title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span>
        <slot>
          <p class="nk-alert__description" v-if="description">{{ description }}</p>
        </slot>
        <i class="nk-alert__closebtn" :class="{ 'is-customed': closeText !== '', 'nk-icon-close': closeText === '' }" v-show="closable" @click="close()">{{closeText}}</i>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  const TYPE_CLASSES_MAP = {
    'success': 'nk-icon-success',
    'warning': 'nk-icon-warning',
    'error': 'nk-icon-error'
  }
  export default {
    name: 'NkAlert',

    props: {
      title: {
        type: String,
        default: '',
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'info'
      },
      closable: {
        type: Boolean,
        default: true
      },
      closeText: {
        type: String,
        default: ''
      },
      showIcon: Boolean,
      center: Boolean
    },

    data() {
      return {
        visible: true
      }
    },

    methods: {
      close() {
        this.visible = false
        this.$emit('close')
      }
    },

    computed: {
      typeClass() {
        return `nk-alert--${this.type}`
      },

      iconClass() {
        return TYPE_CLASSES_MAP[this.type] || 'nk-icon-info'
      },

      isBigIcon() {
        return this.description || this.$slots.default ? 'is-big' : ''
      },

      isBoldTitle() {
        return this.description || this.$slots.default ? 'is-bold' : ''
      }
    }
  }
</script>
