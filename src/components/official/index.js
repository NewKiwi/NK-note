import KButton from './packages/button'
import KBreadcrumb from './packages/breadcrumb'
import KBreadcrumbItem from './packages/breadcrumb-item'
import KScrollBar from './packages/scroll-bar'
import KCarousel from './packages/carousel'
import KCarouselItem from './packages/carousel-item'
import KLazyload from './packages/lazy-load'
import KSimpleMenu from './packages/simple-menu'
import KSimpleMenuItem from './packages/simple-menu-item'
import KPopover from './packages/popover'
import KRate from './packages/rate'
import KEllipsis from './packages/ellipsis'
import KForm from './packages/form'
import KFormItem from './packages/form-item'
import KInput from './packages/input'
import KRadioGroup from './packages/radio-group'
import KRadioButton from './packages/radio-button'
import KWaterfall from './packages/waterfall'
import KWaterfallItem from './packages/waterfall-item'
import KScrollPane from './packages/scroll-pane'
import KCollapseTransition from './packages/collapse-transition'
import KDialog from './packages/dialog'
import KSelect from './packages/select'
import KOption from './packages/option'
import KInputNumber from './packages/input-number'
import KDatePicker from './packages/date-picker'
import KCollapse from './packages/collapse/src/collapse'
import KCollapseItem from './packages/collapse/src/collapse-item'
import KCheckbox from './packages/checkbox'
import KMessage from './packages/message'
import Loading from './packages/loading'
import KRadio from './packages/radio'
import KPagination from './packages/pagination'

const components = [
  KButton,
  KBreadcrumb,
  KBreadcrumbItem,
  KScrollBar,
  KCarousel,
  KCarouselItem,
  KLazyload,
  KPopover,
  KSimpleMenu,
  KSimpleMenuItem,
  KRate,
  KForm,
  KFormItem,
  KInput,
  KRadioGroup,
  KRadioButton,
  KWaterfall,
  KWaterfallItem,
  KScrollPane,
  KCollapseTransition,
  KDialog,
  KSelect,
  KOption,
  KInputNumber,
  KDatePicker,
  KCollapse,
  KCollapseItem,
  KCheckbox,
  KRadio,
  KPagination
]

const install = function(Vue) {
  components.map(component => {
    Vue.component(component.name, component)
  })

  Vue.directive('ellipsis', KEllipsis)
  Vue.use(Loading.directive)

  Vue.prototype.$message = KMessage
}

export default install
