import Loading from 'muse-ui-loading'

let instance = null
let options = {
  text: '拼命加载中...',
  color: 'primary',
  overlayColor: 'RGBA(0, 0, 0, .15)'
}
let getInstance = () => {
  // 有可能会出现多实例情况？
  if (instance) {
    instance.close()
    instance = null
  }
  instance = Loading(options)
  return instance
}

export default {
  show() {
    getInstance()
  },
  hide() {
    if (instance) {
      instance.close()
      instance = null
    }
  }
}
