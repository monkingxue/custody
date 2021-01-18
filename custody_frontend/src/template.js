import Vue from 'vue'
import App from './Template.vue'
import router from './router/template'
import bootstrapStore from './core/store'
import VueI18n from 'vue-i18n'
import { DI, filters } from 'core'
import Vant from 'vant'
import 'vant/lib/index.css'
import dayjs from 'dayjs'
import './public.css'
import './core/constant'
import elementInView from './core/directives/elementInView'

const version = `0.0.1 (${dayjs(process.env.BUNDLE_TIME).format('MMDDHHmm')})`
window.version = version

Vue.prototype.$dayjs = dayjs
Vue.prototype.$template = process.env.TEMPLATE_NAME
Vue.use(Vant)
Vue.use(VueI18n)
Vue.use(Vue.directive(elementInView.name, elementInView))

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

const isProd = process.env.NODE_ENV !== 'development'
DI.bindValue('isProd', isProd)

const i18n = new VueI18n({
  locale: 'zh-CN',    // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
  messages: {
    'zh-CN': require('./i18n/lang/cn'),   // 中文语言包
    'en-US': require('./i18n/lang/en')    // 英文语言包
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

DI.bindValue('filters', filters)
DI.bindValue('vue', app)
DI.get('auth').syncUser()
DI.get('store').dispatch('SYNC_MARKET')
DI.get('store').dispatch('SYNC_BASIC_PAIR')
const isFromApp = DI.get('utils').isFromApp()
if (isFromApp) DI.get('bridge')
DI.get('store').dispatch('SYNC_SETTING')
setInterval(() => {
  DI.get('auth').syncUser()
}, 1000 * 5) // 全局账户状态轮询 不要删
