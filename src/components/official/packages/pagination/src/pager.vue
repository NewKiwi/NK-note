<template>
  <ul @click="onPagerClick" class="k-pager">
    <li
      :class="{ active: currentPage === 1, disabled }"
      v-if="pageCount > 0"
      class="number">1</li>
    <li
      class="k-icon more btn-quickprev"
      :class="[quickprevIconClass, { disabled }]"
      v-if="showPrevMore"
      @mouseenter="onMouseenter('left')"
      @mouseleave="quickprevIconClass = 'k-icon-more'">
    </li>
    <li
      v-for="pager in pagers"
      :key="pager"
      :class="{ active: currentPage === pager, disabled }"
      class="number">{{ pager }}</li>
    <li
      class="k-icon more btn-quicknext"
      :class="[quicknextIconClass, { disabled }]"
      v-if="showNextMore"
      @mouseenter="onMouseenter('right')"
      @mouseleave="quicknextIconClass = 'k-icon-more'">
    </li>
    <li
      :class="{ active: currentPage === pageCount, disabled }"
      class="number"
      v-if="pageCount > 1">{{ pageCount }}</li>
  </ul>
</template>

<script type="text/babel">
  export default {
    name: 'KPager',

    props: {
      currentPage: Number,

      pageCount: Number,

      pagerCount: Number,

      disabled: Boolean
    },

    watch: {
      showPrevMore(val) {
        if (!val) this.quickprevIconClass = 'k-icon-more'
      },

      showNextMore(val) {
        if (!val) this.quicknextIconClass = 'k-icon-more'
      }
    },

    methods: {
      onPagerClick(event) {
        const target = event.target
        if (target.tagName === 'UL' || this.disabled) {
          return
        }

        let newPage = Number(event.target.textContent)
        const pageCount = this.pageCount
        const currentPage = this.currentPage
        const pagerCountOffset = this.pagerCount - 2

        if (target.className.indexOf('more') !== -1) {
          if (target.className.indexOf('quickprev') !== -1) {
            newPage = currentPage - pagerCountOffset
          } else if (target.className.indexOf('quicknext') !== -1) {
            newPage = currentPage + pagerCountOffset
          }
        }

        /* istanbul ignore if */
        if (!isNaN(newPage)) {
          if (newPage < 1) {
            newPage = 1
          }

          if (newPage > pageCount) {
            newPage = pageCount
          }
        }

        if (newPage !== currentPage) {
          this.$emit('change', newPage)
        }
      },

      onMouseenter(direction) {
        if (this.disabled) return
        if (direction === 'left') {
          this.quickprevIconClass = 'k-icon-d-arrow-left'
        } else {
          this.quicknextIconClass = 'k-icon-d-arrow-right'
        }
      }
    },

    computed: {
      pagers() {
        const pagerCount = this.pagerCount
        const halfPagerCount = (pagerCount - 1) / 2

        const currentPage = Number(this.currentPage)
        const pageCount = Number(this.pageCount)

        let showPrevMore = false
        let showNextMore = false

        if (pageCount > pagerCount) {
          if (currentPage > pagerCount - halfPagerCount) {
            showPrevMore = true
          }

          if (currentPage < pageCount - halfPagerCount) {
            showNextMore = true
          }
        }

        const array = []

        if (showPrevMore && !showNextMore) {
          const startPage = pageCount - (pagerCount - 2)
          for (let i = startPage; i < pageCount; i++) {
            array.push(i)
          }
        } else if (!showPrevMore && showNextMore) {
          for (let i = 2; i < pagerCount; i++) {
            array.push(i)
          }
        } else if (showPrevMore && showNextMore) {
          const offset = Math.floor(pagerCount / 2) - 1
          for (let i = currentPage - offset; i <= currentPage + offset; i++) {
            array.push(i)
          }
        } else {
          for (let i = 2; i < pageCount; i++) {
            array.push(i)
          }
        }

        this.showPrevMore = showPrevMore
        this.showNextMore = showNextMore

        return array
      }
    },

    data() {
      return {
        current: null,
        showPrevMore: false,
        showNextMore: false,
        quicknextIconClass: 'k-icon-more',
        quickprevIconClass: 'k-icon-more'
      }
    }
  }
</script>

<style lang="scss">
@import '../../../src/styles/_variable.scss';
.k-pagination {
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: 700
}

.k-pagination::after,
.k-pagination::before {
    display: table;
    content: ""
}

.k-pagination::after {
    clear: both
}

.k-pagination button,
.k-pagination span:not([class*=suffix]) {
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    vertical-align: top;
    -webkit-box-sizing: border-box;
    box-sizing: border-box
}

.k-pager li,
.k-pagination__editor {
    -webkit-box-sizing: border-box;
    text-align: center
}

.k-pagination .k-input__inner {
    text-align: center;
    -moz-appearance: textfield;
    line-height: normal
}

.k-pagination .k-input__suffix {
    right: 0;
    -webkit-transform: scale(.8);
    transform: scale(.8)
}
.k-pagination button {
    border: none;
    padding: 0 6px;
    background: 0 0
}

.k-pagination button:focus {
    outline: 0
}

.k-pagination button:hover {
    color: $mainColor;
}

.k-pagination button:disabled {
    color: #c0c4cc;
    background-color: #fff;
    cursor: not-allowed
}

.k-pagination .btn-next,
.k-pagination .btn-prev {
    background: center center no-repeat #fff;
    background-size: 16px;
    cursor: pointer;
    margin: 0;
    color: #303133
}

.k-pagination .btn-next .k-icon,
.k-pagination .btn-prev .k-icon {
    display: block;
    font-size: 12px;
    font-weight: 700
}

.k-pagination .btn-prev {
    padding-right: 12px
}

.k-pagination .btn-next {
    padding-left: 12px
}

.k-pagination .k-pager li.disabled {
    color: #c0c4cc;
    cursor: not-allowed
}

.k-pager li,
.k-pager li.btn-quicknext:hover,
.k-pager li.btn-quickprev:hover {
    cursor: pointer
}
.k-pagination.is-background .btn-next,
.k-pagination.is-background .btn-prev,
.k-pagination.is-background .k-pager li {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    min-width: 30px;
    border-radius: 2px
}

.k-pagination.is-background .btn-next.disabled,
.k-pagination.is-background .btn-next:disabled,
.k-pagination.is-background .btn-prev.disabled,
.k-pagination.is-background .btn-prev:disabled,
.k-pagination.is-background .k-pager li.disabled {
    color: #c0c4cc
}

.k-pagination.is-background .k-pager li:not(.disabled):hover {
    color: $mainColor;
}

.k-pagination.is-background .k-pager li:not(.disabled).active {
    background-color: $mainColor;;
    color: #fff
}

.k-pagination.is-background.k-pagination--small .btn-next,
.k-pagination.is-background.k-pagination--small .btn-prev,
.k-pagination.is-background.k-pagination--small .k-pager li {
    margin: 0 3px;
    min-width: 22px
}

.k-pager,
.k-pager li {
    vertical-align: top;
    margin: 0;
    display: inline-block
}

.k-pager {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    list-style: none;
    font-size: 0
}
.k-pager .more::before {
    line-height: 30px
}

.k-pager li {
    padding: 0 4px;
    background: #fff;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    box-sizing: border-box
}

.k-menu--collapse .k-menu .k-submenu,
.k-menu--popup {
    min-width: 200px
}

.k-dialog,
.k-dialog__footer {
    -webkit-box-sizing: border-box
}

.k-pager li.btn-quicknext,
.k-pager li.btn-quickprev {
    line-height: 28px;
    color: #303133
}

.k-pager li.btn-quicknext.disabled,
.k-pager li.btn-quickprev.disabled {
    color: #c0c4cc
}

.k-pager li.active+li {
    border-left: 0
}

.k-pager li:hover {
    color: $mainColor;
}

.k-pager li.active {
    color: $mainColor;;
    cursor: default
}

</style>
