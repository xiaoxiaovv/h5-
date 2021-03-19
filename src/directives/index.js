import clickoutside from './src/clickoutside'

export default {
  install(Vue, opts = {}) {
    Vue.directive('click-outside', clickoutside)
  }
}
