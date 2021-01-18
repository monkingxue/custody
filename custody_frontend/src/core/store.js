import Vue from 'vue'
import Vuex from 'vuex'
import { DI } from 'core'
import { ssr, auth, market, pair, setting, invite, depth } from './store/store'
import pairV2 from './store/pairV2'
import ranking from './store/ranking'
import articles from './store/articles'
import stock from './store/stock'
import yubibao from './store/yubibao'
import notification from './store/notification'
// import VuexLocal from "./store/vuexLocal.js"

Vue.use(Vuex)

export default function bootstrapS() {
  return new Vuex.Store({
    strict: !DI.get('isProd'),
    // plugins: [VuexLocal],
    modules: {
      ssr: ssr(),
      auth,
      market,
      pair,
      pairV2,
      setting,
      invite,
      depth,
      ranking,
      articles,
      notification,
      yubibao,
      stock
    }
  })
}
