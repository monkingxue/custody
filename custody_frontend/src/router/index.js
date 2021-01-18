import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home'
import explore from '@/views/explore'
import buy from '@/views/buy'
import account from '@/views/account'
import pair from '@/views/pair'
import wallet from '@/views/walletMain'
import login from '@/views/login'
import notFound from '@/views/notFound'
import { DI } from 'core'
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { index: 0, public: true },
      component: home
    },
    {
      path: '/explore',
      name: 'explore',
      meta: { index: 0, public: true },
      component: explore
    },
    {
      path: '/ranking',
      name: 'ranking',
      meta: { index: 1, public: true },
      component: () => import('@/views/ranking')
    },
    {
      path: '/fiat',
      name: 'buy',
      meta: { index: 1, public: true },
      component: buy
    },
    {
      path: '/wallet',
      name: 'wallet',
      meta: { index: 0, public: true },
      component: wallet
    },
    {
      path: '/assetAnalysis',
      name: 'assetAnalysis',
      meta: { index: 1 },
      component: () => import('@/views/assetAnalysis')
    },
    {
      path: '/pair',
      name: 'pair',
      meta: { index: 1, public: true },
      component: pair
    },
    {
      path: '/search',
      name: 'search',
      meta: { index: 2, public: true },
      component: () => import('@/views/pair/search')
    },
    {
      path: '/exchange/:symbol',
      name: 'exchange',
      meta: { index: 2, public: true },
      component: () => import('@/views/exchange')
    },
    {
      path: '/chart/:symbol',
      name: 'chart',
      meta: { index: 1, public: true },
      component: () => import('@/views/chart')
    },
    {
      path: '/stockDetail/:symbol',
      name: 'stockDetail',
      meta: { index: 1, public: true },
      component: () => import('@/views/stock/detail')
    },
    {
      path: '/orderbook/:symbol',
      name: 'orderbook',
      meta: { index: 2, public: true },
      component: () => import('@/views/orderbook')
    },
    {
      path: '/exchange/:orderType/:symbol',
      name: 'exchangeAllOrders',
      meta: { index: 2 },
      component: () => import('@/views/exchangeOrder')
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
      path: '/landingA',
      name: 'landingA',
      meta: { public: true },
      component: () => import('@/views/landingA')
    },
    {
      path: '/landingRed',
      name: 'landingRed',
      meta: { public: true },
      component: () => import('@/views/landingRed')
    },
    {
      path: '/agreement',
      name: 'agreement',
      meta: { index: 1, public: true },
      component: () => import('@/views/agreement')
    },
    {
      path: '/otherset',
      name: 'otherset',
      meta: { index: 1 },
      component: () => import('@/views/otherset')
    },
    {
      path: '/security',
      name: 'security',
      meta: { index: 1 },
      component: () => import('@/views/security')
    },
    {
      path: '/2faSetting',
      name: '2faSetting',
      component: () => import('@/views/2faSetting')
    },
    {
      path: '/2faIntro',
      name: '2faIntro',
      component: () => import('@/views/2faIntro')
    },
    {
      path: '/safeDescription',
      name: 'safeDescription',
      meta: { index: 1 },
      component: () => import('@/views/safeDescription')
    },
    {
      path: '/comparePrice',
      name: 'comparePrice',
      meta: { index: 1, public: true },
      component: () => import('@/views/comparePrice')
    },
    {
      path: '/vip',
      name: 'vip',
      meta: { index: 1 },
      component: () => import('@/views/vip')
    },
    {
      path: '/vip/detail',
      name: 'vipDetail',
      meta: { index: 2 },
      component: () => import('@/views/vip/detail')
    },
    {
      path: '/yubibao',
      name: 'yubibao',
      meta: { index: 1 },
      component: () => import('@/views/yubibao/index')
    },
    {
      path: '/yubibao/intro',
      name: 'yubibaoIntro',
      meta: { index: 1 },
      component: () => import('@/views/yubibao/intro')
    },
    {
      path: '/yubibao/operation',
      name: 'yubibaoOperation',
      meta: { index: 1 },
      component: () => import('@/views/yubibao/operation')
    },
    {
      path: '/yubibao/operationContract',
      name: 'yubibaoOperationContract',
      meta: { index: 1 },
      component: () => import('@/views/yubibao/operationContract')
    },
    {
      path: '/yubibao/operationContractDetail',
      name: 'yubibaoOperationContractDetail',
      meta: { index: 1 },
      component: () => import('@/views/yubibao/operationContractDetail')
    },
    {
      path: '/yubibao/result',
      name: 'yubibaoResult',
      meta: { index: 1 },
      component: () => import('@/views/yubibao/result')
    },
    {
      path: '/yubibao/history',
      name: 'yubibaoHistory',
      meta: { index: 1 },
      component: () => import('@/views/yubibao/history')
    },
    {
      path: '/helpCenter',
      name: 'helpCenter',
      meta: { index: 1 },
      component: () => import('@/views/helpCenter')
    },
    {
      path: '/asset',
      name: 'asset',
      meta: { index: 2 },
      component: () => import('@/views/asset')
    },
    {
      path: '/dnwDetail',
      name: 'dnwDetail',
      meta: { index: 2 },
      component: () => import('@/views/asset/dnwDetail')
    },
    {
      path: '/contactkf',
      name: 'contactkf',
      meta: { index: 2 },
      component: () => import('@/views/contactkf')
    },
    {
      path: '/password',
      name: 'password',
      meta: { index: 2 },
      component: () => import('@/views/password')
    },
    {
      path: '/sellMethod',
      name: 'sellMethod',
      meta: { index: 1 },
      component: () => import('@/views/sellMethod')
    },
    {
      path: '/sellMethodForm',
      name: 'sellMethodForm',
      meta: { index: 2 },
      component: () => import('@/views/sellMethodForm')
    },
    {
      path: '/sellDetail',
      name: 'sellDetail',
      meta: { index: 2 },
      component: () => import('@/views/sellDetail')
    },
    {
      path: '/legalActuallPrice',
      name: 'legalActuallPrice',
      meta: { index: 2 },
      component: () => import('@/views/legalActuallPrice')
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      meta: { index: 3 },
      component: () => import('@/views/withdraw')
    },
    {
      path: '/deposit',
      name: 'deposit',
      meta: { index: 3 },
      component: () => import('@/views/deposit')
    },
    {
      path: '/selectBI',
      name: 'selectBI',
      meta: { index: 3 },
      component: () => import('@/views/selectBI')
    },
    {
      path: '/orderList',
      name: 'orderList',
      meta: { index: 1 },
      component: () => import('@/views/allOrders')
    },
    {
      path: '/orderList/otc',
      name: 'orderListOtc',
      meta: { index: 1 },
      component: () => import('@/views/orderListOtc')
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
      path: '/orderDetail',
      name: 'orderDetail',
      meta: { index: 3 },
      component: () => import('@/views/orderDetail')
    },
    {
      path: '/exchangeOrderDetail/:id',
      name: 'exchangeOrderDetail',
      meta: { index: 3 },
      component: () => import('@/views/exchangeOrder/detail')
    },
    {
      path: '/orderAlipay',
      name: 'orderAlipay',
      meta: { index: 2 },
      component: () => import('@/views/orderAlipay')
    },
    {
      path: '/redEnvelope',
      name: 'redEnvelope',
      meta: { index: 1 },
      component: () => import('@/views/redEnvelope')
    },
    {
      path: '/redEnvelopePoster',
      name: 'redEnvelopePoster',
      meta: { index: 2 },
      component: () => import('@/views/redEnvelopePoster')
    },
    {
      path: '/realnameSuccess',
      name: 'realnameSuccess',
      meta: { index: 6 },
      component: () => import('@/views/realname/realnameSuccess')
    },
    {
      path: '/payment',
      name: 'payment',
      meta: { index: 1 },
      component: () => import('@/views/payment')
    },
    {
      path: '/imgPreview',
      name: 'imgPreview',
      component: () => import('@/views/imgPreview')
    },
    {
      path: '/weixin',
      name: 'weixin',
      meta: { index: 1 },
      component: () => import('@/views/weixin')
    },
    {
      path: '/avatar',
      name: 'avatar',
      meta: { index: 1 },
      component: () => import('@/views/avatar')
    },
    {
      path: '/nickname',
      name: 'nickname',
      meta: { index: 1 },
      component: () => import('@/views/nickname')
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('@/views/portfolio')
    },
    {
      path: '/my',
      name: 'my',
      meta: { index: 1 },
      component: () => import('@/views/my')
    },
    {
      path: '/myInvite',
      name: 'myInvite',
      meta: { index: 1 },
      component: () => import('@/views/myInvite')
    },
    {
      path: '/myAssets',
      name: 'myAssets',
      meta: { index: 1 },
      component: () => import('@/views/myAssets')
    },
    {
      path: '/invite',
      name: 'invite',
      meta: { index: 2 },
      component: () => import('@/views/invite')
    },
    {
      path: '/dev',
      name: 'dev',
      meta: { public: true },
      component: () => import('@/views/dev')
    },
    {
      path: '/download',
      name: 'download',
      meta: { public: true, index: 2 },
      component: () => import('@/views/download')
    },
    {
      path: '/aboutUs',
      name: 'aboutUs',
      meta: { public: true, index: 2 },
      component: () => import('@/views/aboutUs')
    },
    {
      path: '/moreBuyMethods',
      name: 'moreBuyMethods',
      meta: { public: true, index: 2 },
      component: () => import('@/views/moreBuyMethods')
    },
    {
      path: '/guide',
      name: 'guide',
      meta: { public: true, index: 1 },
      component: () => import('@/views/guide')
    },
    {
      path: '/guideFiat',
      name: 'guideFiat',
      meta: { public: true, index: 1 },
      component: () => import('@/views/guide/fiat')
    },
    {
      path: '/guideBibi',
      name: 'guideBibi',
      meta: { public: true, index: 1 },
      component: () => import('@/views/guide/bibi')
    },
    {
      path: '/guideDeposit',
      name: 'guideDeposit',
      meta: { public: true, index: 1 },
      component: () => import('@/views/guide/deposit')
    },
    {
      path: '/guidePortfolio',
      name: 'guidePortfolio',
      meta: { public: true },
      component: () => import('@/views/guide/portfolio')
    },
    {
      path: '/posterBibi',
      name: 'posterBibi',
      meta: { public: true, index: 1 },
      component: () => import('@/views/guide/posterbibi')
    },
    {
      path: '/languages',
      name: 'languages',
      meta: { public: true, index: 2 },
      component: () => import('@/views/languages')
    },
    {
      path: '/mining',
      name: 'mining',
      meta: { index: 1 },
      component: () => import('@/views/mining')
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

router.afterEach((to, from) => {
  // ranking 返回时自己滚动
  const isBackToRanking = () => to.name === 'ranking' && from.name !== 'explore'
  // home 页面有自己的滚动条逻辑
  if (['home'].indexOf(to.name) > -1 || isBackToRanking()) return
  setTimeout(() => {
    const app = document.querySelector('#app')
    if (app && app.scrollTop) {
      app.scrollTop = 0
    }
    window.scroll(0, 0)
  }, 100)
})

export default router
