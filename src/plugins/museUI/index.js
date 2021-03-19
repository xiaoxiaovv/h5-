import MuseUI from 'muse-ui'
import Toast from 'muse-ui-toast'
import Loading from 'muse-ui-loading'
import Message from 'muse-ui-message'
import 'muse-ui-loading/dist/muse-ui-loading.css' // load css
import 'muse-ui/dist/muse-ui.css'
import theme from 'muse-ui/lib/theme'
theme.add('teal', {
  primary: '#32a4f9',
  secondary: '#ff4081',
  success: '#4caf50',
  warning: '#ffeb3b',
  white: '#ffffff'
}, 'light')

theme.use('teal')
let config = {
  text: '拼命加载中...',
  color: 'primary',
  overlayColor: 'RGBA(0, 0, 0, .15)'
}
export default {
  install(Vue) {
    Vue.use(MuseUI)
    Vue.use(Toast, {
      position: 'top'
    })
    Vue.use(Message)
    Vue.use(Loading, config)
  }
}
