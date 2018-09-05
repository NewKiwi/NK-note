<template>
  <transition name="k-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="k-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="k-loading-spinner">
        <svg v-if="!spinner" class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <i v-else :class="spinner"></i>
        <p v-if="text" class="k-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        text: null,
        spinner: null,
        background: null,
        fullscreen: true,
        visible: false,
        customClass: ''
      }
    },

    methods: {
      handleAfterLeave() {
        this.$emit('after-leave')
      },
      setText(text) {
        this.text = text
      }
    }
  }
</script>

<style lang="scss">
@import '../../../src/styles/_variable.scss';
.k-icon-loading {
    -webkit-animation: rotating 2s linear infinite;
    animation: rotating 2s linear infinite
}
@-webkit-keyframes rotating {
    0% {
        -webkit-transform: rotateZ(0);
        transform: rotateZ(0)
    }
    100% {
        -webkit-transform: rotateZ(360deg);
        transform: rotateZ(360deg)
    }
}

@keyframes rotating {
    0% {
        -webkit-transform: rotateZ(0);
        transform: rotateZ(0)
    }
    100% {
        -webkit-transform: rotateZ(360deg);
        transform: rotateZ(360deg)
    }
}
.k-loading-fade-enter,
.k-loading-fade-leave-active{
  opacity: 0
}
.k-loading-parent--relative {
    position: relative!important
}

.k-loading-parent--hidden {
    overflow: hidden!important
}

.k-loading-mask {
    position: absolute;
    z-index: 2000;
    background-color: rgba(255, 255, 255, .9);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -webkit-transition: opacity .3s;
    transition: opacity .3s
}

.k-loading-mask.is-fullscreen {
    position: fixed
}

.k-loading-mask.is-fullscreen .k-loading-spinner {
    margin-top: -25px
}

.k-loading-mask.is-fullscreen .k-loading-spinner .circular {
    height: 50px;
    width: 50px
}

.k-loading-spinner {
    top: 50%;
    margin-top: -21px;
    width: 100%;
    text-align: center;
    position: absolute
}
.k-loading-spinner .k-loading-text {
    color: $mainColor;
    margin: 3px 0;
    font-size: 14px
}

.k-loading-spinner .circular {
    height: 42px;
    width: 42px;
    -webkit-animation: loading-rotate 2s linear infinite;
    animation: loading-rotate 2s linear infinite
}

.k-loading-spinner .path {
    -webkit-animation: loading-dash 1.5s ease-in-out infinite;
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: $mainColor;
    stroke-linecap: round
}

.k-loading-spinner i {
    color: $mainColor;
}

@-webkit-keyframes loading-rotate {
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}

@keyframes loading-rotate {
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}

@-webkit-keyframes loading-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px
    }
}

@keyframes loading-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px
    }
}

</style>

