import Vue from 'vue'
import Router from 'vue-router'
import buy from '@/views/template-buy'
import account from '@/views/template-account'
import login from '@/views/template-login'
import notFound from '@/views/notFound'
import { DI } from 'core'
Vue.use(Router)

let router = new Router({
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'buy',
      meta: { index: 0, public: true },
      component: buy
    },
    {
      path: '/account',
      name: 'account',
      meta: { index: 0, public: true },
      component: account
    },
    {
      path: '/login',
      name: 'login',
      meta: { index: 0, public: true },
      component: login
    },
    {
      path: '/agreement',
      name: 'agreement',
      meta: { index: 1, public: true },
      component: () => import('@/views/agreement')
    },
    {
      path: '/orderList',
      name: 'orderList',
      meta: { index: 1 },
      component: () => import('@/views/orderList')
    },
    {
      path: '/payment',
      name: 'payment',
      meta: { index: 1 },
      component: () => import('@/views/payment')
    },
    {
      path: '/orderAlipay',
      name: 'orderAlipay',
      meta: { index: 2 },
      component: () => import('@/views/orderAlipay')
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      meta: { index: 3 },
      component: () => import('@/views/template-orderDetail')
    },
    {
      path: '/realname',
      name: 'realname',
      meta: { index: 1 },
      component: () => import('@/views/realname/realname')
    },
    {
      path: '/otherCertify',
      name: 'otherCertify',
      meta: { index: 1 },
      component: () => import('@/views/realname/otherCertify')
    },
    {
      path: '/aboutUs',
      name: 'aboutUs',
      meta: { public: true, index: 2 },
      component: () => import('@/views/aboutUs')
    },
    {
      path: '/contactkf',
      name: 'contactkf',
      meta: { index: 2 },
      component: () => import('@/views/contactkf')
    },
    {
      path: "*",
      meta: { public: true },
      component: notFound
    }
  ]
})
DI.bindValue('router', router)

router.beforeEach((to, from, next) => {
  if (to.path) {
    window._hmt && window._hmt.push(['_trackPageview', '/#' + to.fullPath])
  }
  if (!to.meta.public && !DI.get('auth').getToken().token) {
    DI.get('router').push({ name: 'login' })
  } else {
    next()
  }
})

router.afterEach(() => {
  setTimeout(() => {
    const app = document.querySelector('#app')
    if (app && app.scrollTop) {
      app.scrollTop = 0
    }
    window.scroll(0, 0)
  }, 100)
})

export default router
