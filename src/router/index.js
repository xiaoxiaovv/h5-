import Vue from 'vue'
import Router from 'vue-router'
import { getDocmentTitle } from '@/api/vueAPI.js'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/modules/index')
    },
    // {
    //   path: '/wx/:wxId',
    //   name: 'wx',
    //   component: () => import('@/modules/wx/paySelect')
    // },
    // {
    //   path: '/zfb/:zfbId',
    //   name: 'zfb',
    //   component: () => import('@/modules/zfb/paySuccess')
    // },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: () => import('@/modules/qrcode')
    },
    {
      path: '/wx/paySelect',
      name: 'paySelect',
      component: () => import('@/modules/wx/paySelect')
    },
    {
      path: '/wx/pay',
      name: 'pay',
      component: () => import('@/modules/wx/pay')
    },
    {
      path: '/wx/paySuccess',
      name: 'paySuccess',
      component: () => import('@/modules/wx/paySuccess')
    },
    {
      path: '/wx/payError',
      name: 'payError',
      component: () => import('@/modules/wx/payError')
    },
    {
      path: '/wx/memberCard',
      name: 'memberCard',
      component: () => import('@/modules/wx/memberCard')
    },
    {
      path: '/wx/memberDetails',
      name: 'memberDetails',
      component: () => import('@/modules/wx/memberDetails')
    },
    {
      path: '/wx/memberServiceAgreement',
      name: 'memberServiceAgreement',
      component: () => import('@/modules/wx/memberServiceAgreement')
    },
    {
      path: '/zfb/paySuccess',
      name: 'zfb',
      component: () => import('@/modules/zfb/paySuccess')
    },
    {
      path: '/advertisement',
      name: 'advertisement',
      component: () => import('@/modules/advertisement')
    },
  ]
})

router.beforeEach((to, from, next) => {
  next()
})
/*
function setDocumentTitle(to) {
  let title = sessionStorage.getItem('title')
  if (title) {
    document.title = title
  } else {
    let userId = sessionStorage.getItem('userId') || to.query.userId
    if (userId) {
      let params = {
        userId: userId
      }
      getDocmentTitle(params).then(res => {
        document.title = res.obj
        sessionStorage.setItem('title', res.obj)
      }, err => {
        document.title = '支付'
      })
    } else {
      document.title = '支付'
    }
  }
}
*/
router.afterEach(to => {
  if (to.name !== 'index') {
    // setDocumentTitle(to)
    document.title = '向商户付款'
  }
  // window.scrollTo(0, 0)
})

export default router
