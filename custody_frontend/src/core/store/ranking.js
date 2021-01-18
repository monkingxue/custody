import { DI } from 'core'
import { Message } from 'components'
import Vue from 'vue'

export const SYNC_RANKING_PAIR = 'SYNC_RANKING_PAIR'
export const SYNC_CRYPTO_MARKET_CAP = 'SYNC_CRYPTO_MARKET_CAP'
export const SYNC_CRYPTO_DOMINANCE = 'SYNC_CRYPTO_DOMINANCE'

export default {
  state: {
    loading: false,
    loadEndFlag: {},
    ranking: {},
    cryptoMarketCap: {},
    cryptoDominance: {
      "1d": [],
      "7d": [],
      "1m": [],
      "3m": [],
      "1y": [],
      "all": []
    }
  },
  mutations: {
    [SYNC_RANKING_PAIR](state, payload) {
      let objKey = payload.type
      if (payload.param) {
        objKey += Object.values(payload.param)
      }
      if (objKey === 'otcPremium') {
        // otcPremium
        if (payload.res && payload.res.items && payload.res.items.length === 0) {
          Vue.set(state.loadEndFlag, objKey, true)
          return
        }
        Vue.set(state.ranking, objKey, payload.res.items)
        return
      }

      if (payload.res.length === 0) {
        Vue.set(state.loadEndFlag, objKey, true)
        return
      }
      Vue.set(state.ranking, objKey, payload.res)
    },
    [SYNC_CRYPTO_MARKET_CAP](state, payload) {
      state.cryptoMarketCap = payload
    },
    [SYNC_CRYPTO_DOMINANCE](state, payload) {
      Vue.set(state.cryptoDominance, payload.period, payload.res)
    }
  },
  actions: {
    [SYNC_RANKING_PAIR]({ commit }, param) {
      let endpoint = DI.get('RANKING_LABEL_DATA')[param.type]['endpoint']
      if (param.param) {
        // for hotSearch & priceChange
        const paramKey = Object.keys(param.param)
        endpoint = `${endpoint}?${paramKey}=${param.param[paramKey]}`
      }
      return DI.get('baseMainHttp').get(endpoint)
        .then(res => {
          commit(SYNC_RANKING_PAIR, { ...param, res })
        })
        .catch(Message)
        .then(() => {
          this.loading = false
          this.loaded = true
        })
    },
    [SYNC_CRYPTO_MARKET_CAP]({ commit }) {
      return DI.get('rankingHttp')
        .getCryptoMarketCap()
        .then((res) => {
          commit(SYNC_CRYPTO_MARKET_CAP, res)
        })
        .catch(Message)
    },
    [SYNC_CRYPTO_DOMINANCE]({ commit }, param) {
      return DI.get('rankingHttp')
        .getCryptoDominance(param.period)
        .then((res) => {
          commit(SYNC_CRYPTO_DOMINANCE, { ...param, res } )
        })
        .catch(Message)
    }
  }
}
