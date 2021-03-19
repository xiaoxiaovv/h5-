// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import plugins from './plugins'
import clickoutside from './directives/src/clickoutside'

Vue.config.productionTip = false
// Vue.use(MuseUI);
Vue.directive('click-outside', clickoutside)

// 安装全局插件
Vue.use(plugins)

// import WeuiVue from 'weui-vue'
// import 'weui-vue/weui.css'
// Vue.use(WeuiVue)
// import './assets/icon/iconfont.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
