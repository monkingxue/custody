import Vue from 'vue'
import App from './App'
import router from './router'
import bootstrapStore from './core/store'
import VueI18n from 'vue-i18n'
import { DI, filters } from 'core'
import Vant from 'vant'
import 'vant/lib/index.css'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import './public.css'
import './core/constant'
import elementInView from './core/directives/elementInView'

const version = `4.10.1 (${dayjs(process.env.BUNDLE_TIME).format('MMDDHHmm')})`
dayjs.locale('zh-cn')
window.version = version

Vue.prototype.$dayjs = dayjs
Vue.use(Vant)
Vue.use(VueI18n)
Vue.use(Vue.directive(elementInView.name, elementInView))

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

const isProd = process.env.NODE_ENV !== 'development'
Vue.prototype.$isProd = isProd
DI.bindValue('isProd', isProd)
DI.bindValue('filters', filters)

const i18n = new VueI18n({
  //*/
  locale: DI.get('offlineStorage').get('LOCALE') || navigator.language, // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
  /*/
  locale: 'zh-CN', // 禁用多语言时使用以行
  //*/
  fallbackLocale: 'zh-CN',
  sync: false,
  silentFallbackWarn: true,
  messages: {
    // 'en-US': require('./locales/en.json'),
    'zh-CN': require('./locales/zh-CN.json'),
    'zh-HK': require('./locales/zh-HK.json')
  }
})

const store = bootstrapStore()
DI.bindValue('store', store)
const app = new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>'
})
DI.bindValue('vue', app)
DI.get('auth').syncUser()
DI.get('store').dispatch('SYNC_MARKET')
DI.get('store').dispatch('SYNC_BASIC_PAIR')
const isFromApp = DI.get('utils').isFromApp()
if (isFromApp) DI.get('bridge')
DI.get('store').dispatch('SYNC_SETTING')

setInterval(() => {
  DI.get('store').dispatch('SYNC_SETTING')
}, 1000 * 60 * 5) // 如果没有更好的方案 每 5 min 更新一次 setting
