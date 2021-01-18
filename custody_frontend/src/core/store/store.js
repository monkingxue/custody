import { DI } from 'core'
import { Message } from 'components'
import Vue from 'vue'

/* eslint-disable no-param-reassign */
export const ssr = () => (
  {
    state: {
      content: {}
    },
    mutations: {
      prefetch(state, payload) {
        state.content = { ...state.content, [payload.name]: payload.content }
      }
    }
  }
)

export const SYNC_AUTH = 'SYNC_AUTH'
export let SYNC_AUTH_TIMEOUT = null
export const RESET_AUTH = 'RESET_AUTH'
const USER_AVATAR_CACHE = 'USER_AVATAR_CACHE'
const USER_IDENTITY = 'USER_IDENTITY'
const USER_NICKNAME = 'USER_NICKNAME'
export const SYNC_BALANCE_CHART = 'SYNC_BALANCE_CHART'

const authObj = {
  balance: {},
  available_balance: {},
  frozen_balance: {}
}
export const auth = {
  state: {
    auth: authObj,
    balanceChart: {}
  },
  mutations: {
    [SYNC_AUTH](state, payload) {
      const avatarCache = DI.get('offlineStorage').get(USER_AVATAR_CACHE)
      if (avatarCache) {
        payload.small_avatar = avatarCache
      }
      state.auth = payload
      DI.get('offlineStorage').set(USER_IDENTITY, payload.identity)
      DI.get('offlineStorage').set(USER_NICKNAME, payload.nickname)
    },
    [RESET_AUTH](state) {
      state.auth = authObj
    },
    [SYNC_BALANCE_CHART](state, payload) {
      Vue.set(state.balanceChart, payload.period, payload.data)
    }
  },
  actions: {
    [SYNC_AUTH]({ commit }) {
      const accountId = DI.get('auth').getToken().id
      if (!accountId) return
      DI.get('accountHttp')
        .getAccountDetail(accountId)
        .then((res) => {
          DI.get('utils').clearPollingToast(res, 'account')
          commit(SYNC_AUTH, res)
          clearTimeout(SYNC_AUTH_TIMEOUT)
          SYNC_AUTH_TIMEOUT = setTimeout(() => {
            DI.get('auth').syncUser()
          }, 1000 * 5)
        }).catch((message) => {
          DI.get('utils').pollingToast(message, 'account')
          // 网络请求有问题的话RESET_AUTH会清空余额
          // commit(RESET_AUTH)
          clearTimeout(SYNC_AUTH_TIMEOUT)
          SYNC_AUTH_TIMEOUT = setTimeout(() => {
            DI.get('auth').syncUser()
          }, 1000 * 5)
        })
    },
    [SYNC_BALANCE_CHART]({ commit }, param) {
      DI.get('accountHttp')
        .getBalanceChart(param)
        .then((res) => {
          commit(SYNC_BALANCE_CHART, { ...res, period: param })
        }).catch(Message)
    }
  }
}

export const SYNC_MARKET = 'SYNC_MARKET'
export const MARKET_TARGET = 'MARKET_TARGET'

export const market = {
  state: {
    market: {
      BTC: {
        buy_price: 1,
        quote_currency_fee: 0
      }
    }
  },
  mutations: {
    [SYNC_MARKET](state, payload) {
      state.market = payload
    }
  },
  actions: {
    [SYNC_MARKET]({ commit }) {
      DI.get('marketHttp')
        .getPrice()
        .then((res) => {
          DI.get('utils').clearPollingToast(res, 'marketPrice')
          commit(SYNC_MARKET, res)
        })
        .catch((message) => {
          DI.get('utils').pollingToast(message, 'marketPrice')
        })
    }
  }
}

export const SYNC_BASIC_PAIR = 'SYNC_BASIC_PAIR'
export const SYNC_PAIR_BY_NAME = 'SYNC_PAIR_BY_NAME'

const BasicPairArr = [
  'BTC_USDT',
  'ETH_USDT'
]
export const pair = {
  state: {
    pairBasic: {},
    pairPrice: {},
    pairItem: {}
  },
  mutations: {
    [SYNC_BASIC_PAIR](state, payload) {
      const pair = payload.pairs
      pair.forEach((item) => {
        Vue.set(state.pairBasic, item.symbol, item)
      })
    },
    [SYNC_PAIR_BY_NAME](state, payload) {
      state.pairItem = DI.get("utils").formatPairItem(payload.pairs[0])
    }
  },
  actions: {
    [SYNC_PAIR_BY_NAME]({ commit }, param) {
      return DI.get('pairHttp')
        .getPairPriceByName([param.name])
        .then((res) => {
          commit(SYNC_PAIR_BY_NAME, res)
        })
        .catch(Message)
    },
    [SYNC_BASIC_PAIR]({ commit }) {
      return DI.get('pairHttp')
        .getPairPriceByName(BasicPairArr)
        .then((res) => {
          commit(SYNC_BASIC_PAIR, res)
        })
        .catch(Message)
    }
  }
}

export const SYNC_SETTING = 'SYNC_SETTING'
export const LOAD_LOCAL_SETTING = 'LOAD_LOCAL_SETTING'
export const SYNC_WALLET_COIN_SETTING = 'SYNC_WALLET_COIN_SETTING'
export const SYNC_OTC_COIN_SETTING = 'SYNC_OTC_COIN_SETTING'

const LOCAL_SETTING_ALL = 'LOCAL_SETTING_ALL'

const formatSetting = (state, payload) => {
  const assetsArr = []
  const fields = payload.asset_fields
  const biInfo = {}
  payload.assets.map(item => {
    const each = {}
    fields.forEach((f, i) => {
      each[f] = item[i]
    })
    assetsArr.push(each)
    biInfo[each.name] = each
  })
  payload.assets = assetsArr
  state.setting = payload
  state.biInfo = biInfo
}

export const setting = {
  state: {
    setting: {
      vip_level_ladder: []
    },
    biInfo: {},
    walletCoinInfo: {},
    otcCoinSetting: []
  },
  mutations: {
    [LOAD_LOCAL_SETTING](state) {
      try {
        let setting = DI.get('offlineStorage').get(LOCAL_SETTING_ALL)
        if (setting) {
          setting = JSON.parse(setting)
          if (setting && setting.vip_level_ladder) {
            formatSetting(state, setting)
          }
        }
      } catch (e) {
        // eslint-disable-line
      }
    },
    [SYNC_SETTING](state, payload) {
      DI.get('offlineStorage').set(LOCAL_SETTING_ALL, JSON.stringify(payload))
      formatSetting(state, payload)
    },
    [SYNC_WALLET_COIN_SETTING](state, payload) {
      Vue.set(state.walletCoinInfo, payload.coin, payload.res)
    },
    [SYNC_OTC_COIN_SETTING](state, payload) {
      Vue.set(state, 'otcCoinSetting', payload)
    }
  },
  actions: {
    [SYNC_WALLET_COIN_SETTING]({ commit }, param) {
      const { coin } = param
      return DI.get('marketHttp')
        .getWalletCoinSetting(coin)
        .then((res) => {
          commit(SYNC_WALLET_COIN_SETTING, {
            coin,
            res
          })
        })
        .catch(Message)
    },
    [SYNC_OTC_COIN_SETTING]({ commit }) {
      return DI.get('marketHttp')
        .getOtcCoinSetting()
        .then((res) => {
          commit(SYNC_OTC_COIN_SETTING, res)
        })
        .catch(Message)
    },
    [SYNC_SETTING]({ commit }) {
      commit(LOAD_LOCAL_SETTING)
      let result
      return DI.get('marketHttp')
        .getSetting()
        .then((res) => {
          result = res
          commit(SYNC_SETTING, res)
        })
        .catch(() => {})
        .then(() => {
          if (!result) {
            setTimeout(() => {
              DI.get('store').dispatch('SYNC_SETTING')
            }, 1000 * 5) // 延时防止网络环境过差造成死循环
          }
        })
    }
  }
}

export const SYNC_INVITE = 'SYNC_INVITE'
export const SYNC_REBATE = 'SYNC_REBATE'
const INVITE_LIST_TOTAL = 'INVITE_LIST_TOTAL'
const REBATE_LIST_TOTAL = 'REBATE_LIST_TOTAL'

const processInviteList = (payload, localName) => {
  const local = DI.get("offlineStorage").get(localName)
  const total = payload.total_length
  if ((local == null && +total !== 0) || +local !== +total) {
    payload["tips"] = true
  }
  DI.get("offlineStorage").set(localName, total)
  return payload
}
export const invite = {
  state: {
    invite: {},
    rebate: {}
  },
  mutations: {
    [SYNC_INVITE](state, payload) {
      payload["items"] = state.invite.items
        ? state.invite.items.concat(payload["items"])
        : payload["items"]
      state.invite = processInviteList(payload, INVITE_LIST_TOTAL)
    },
    [SYNC_REBATE](state, payload) {
      payload["items"] = state.rebate.items
        ? state.rebate.items.concat(payload["items"])
        : payload["items"]
      state.rebate = processInviteList(payload, REBATE_LIST_TOTAL)
    }
  },
  actions: {
    [SYNC_INVITE]({ commit }, param) {
      return DI.get('accountHttp')
        .getInviteList(param && param.page)
        .then((res) => {
          commit(SYNC_INVITE, res)
        })
        .catch(Message)
    },
    [SYNC_REBATE]({ commit }, param) {
      return DI.get('accountHttp')
        .getRebateList(param && param.page)
        .then((res) => {
          commit(SYNC_REBATE, res)
        })
        .catch(() => {})
    }
  }
}

const SYNC_DEPTH = 'SYNC_DEPTH'
const SYNC_DEPTH_LOADED = 'SYNC_DEPTH_LOADED'
const SYNC_DEPTH_ANALYSIS = 'SYNC_DEPTH_ANALYSIS'

export const depth = {
  state: {
    depth: {},
    symbol: "",
    estimateSaveMoney: {},
    loaded: false,
    analysis: {}
  },
  mutations: {
    [SYNC_DEPTH](state, payload) {
      state.depth = payload.orderbooks
      state.symbol = payload.symbol
      Vue.set(state, 'estimateSaveMoney', payload.estimate_save_money)
    },
    [SYNC_DEPTH_LOADED](state, payload) {
      state.loaded = payload
    },
    [SYNC_DEPTH_ANALYSIS](state, payload) {
      Vue.set(state.analysis, payload.coin, payload)
    }
  },
  actions: {
    [SYNC_DEPTH]({ commit }, param) {
      return DI.get('pairHttp')
        .getMarketDepth(param && param.symbol, param && param.limit)
        .then((res) => {
          DI.get('utils').clearPollingToast(res, 'depth')
          commit(SYNC_DEPTH, Object.assign(res, { symbol: param.symbol }))
        })
        .catch((message) => {
          DI.get('utils').pollingToast(message, 'depth')
        })
        .then(() => {
          commit(SYNC_DEPTH_LOADED, true)
        })
    },
    [SYNC_DEPTH_ANALYSIS]({ commit }, param) {
      return DI.get('pairHttp')
        .getDepthAnalysis(param)
        .then((res) => {
          commit(SYNC_DEPTH_ANALYSIS, { ...res, coin: param })
        })
        .catch(Message)
    }
  }
}
