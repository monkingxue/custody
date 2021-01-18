import { DI } from 'core'
import { Message } from 'components'
import Vue from 'vue'

export const SYNC_ALL_PAIR = 'SYNC_ALL_PAIR'
export const SYNC_ALL_PAIR_LOADING = 'SYNC_ALL_PAIR_LOADING'
export const SYNC_FAVORITE_PAIR = 'SYNC_FAVORITE_PAIR'
export const SYNC_FILTER_PAIR = 'SYNC_FILTER_PAIR'
export const SYNC_ASSETS_PAIR = 'SYNC_ASSETS_PAIR'
export const SYNC_RECOMMEND_ASSET = 'SYNC_RECOMMEND_ASSET'
export const SYNC_MARKET_INFO = 'SYNC_MARKET_INFO'
export const CLEAR_MARKET_INFO = 'CLEAR_MARKET_INFO'

export const SYNC_HOT_SEARCH = 'SYNC_HOT_SEARCH'
export const SYNC_SINGLE_ASSETS = 'SYNC_SINGLE_ASSETS'

export default {
  state: {
    tabTarget: 'all',
    allPairList: [],
    pairListPage: 1,
    pairListPageLoading: false,
    pairListLoadEnd: false,
    favoritePairList: null,
    filterieoPairList: [],
    filterexclusivePairList: [],
    recommendAssetList: [],
    marketInfo: [],
    hotSearch: [],
    allPairMap: {}
  },
  mutations: {
    [SYNC_ALL_PAIR](state, payload) {
      state.allPairList = state.allPairList.concat(payload)
      payload.forEach((pair) => {
        state.allPairMap[pair.symbol] = pair
      })
      state.pairListPage += 1
      if (payload.length === 0) {
        state.pairListLoadEnd = true
      }
    },
    [SYNC_ALL_PAIR_LOADING](state, payload) {
      state.pairListPageLoading = payload
    },
    [SYNC_ASSETS_PAIR](state, payload) {
      state.allPairList = state.allPairList.map((e) => {
        const oldPari = e
        const newPair = payload.find((i) => i.symbol === e.symbol)
        if (newPair) return newPair
        return oldPari
      })
    },
    [SYNC_FAVORITE_PAIR](state, payload) {
      state.favoritePairList = payload
    },
    [SYNC_FILTER_PAIR](state, payload) {
      const stateName = `filter${payload.filter}PairList`
      state[stateName] = payload.res
    },
    [SYNC_RECOMMEND_ASSET](state, payload) {
      state.recommendAssetList = payload
    },
    [CLEAR_MARKET_INFO](state) {
      state.marketInfo = []
    },
    [SYNC_MARKET_INFO](state, payload) {
      state.marketInfo = payload
    },
    [SYNC_HOT_SEARCH](state, payload) {
      state.hotSearch = payload
    },
    [SYNC_SINGLE_ASSETS](state, payload) {
      Vue.set(state.allPairMap, payload.symbol, payload)
    }
  },
  actions: {
    [SYNC_ALL_PAIR]({ commit, state }) {
      if (state.pairListPageLoading) return
      if (state.pairListLoadEnd) return
      commit(SYNC_ALL_PAIR_LOADING, true)
      return DI.get('pairHttp')
        .getPairListV2({ params: {
          page: state.pairListPage
        } })
        .then((res) => {
          commit(SYNC_ALL_PAIR, res.assets)
        })
        .catch(() => {})
        .then(() => {
          commit(SYNC_ALL_PAIR_LOADING, false)
        })
    },
    [SYNC_FAVORITE_PAIR]({ commit }) {
      return DI.get('assetHttp')
        .getFavoritePair()
        .then((res) => {
          commit(SYNC_FAVORITE_PAIR, res.favorite_assets)
        })
        .catch(Message)
    },
    [SYNC_FILTER_PAIR]({ commit }, params) {
      let promise
      if (params && params.filter === 'exclusive') {
        promise = DI.get('pairHttp').getHotCoins
      } else {
        promise = DI.get('pairHttp').getIEOCoins
      }
      return promise().then((res) => {
        DI.get('utils').clearPollingToast(res, 'pairlist')
        commit(SYNC_FILTER_PAIR, {
          res,
          filter: params.filter
        })
      })
        .catch((message) => {
          DI.get('utils').pollingToast(message, 'pairlist')
        })
    },
    [SYNC_ASSETS_PAIR]({ commit }, param) {
      return DI.get('pairHttp')
        .getPairListV2({ params: {
          assets: param.query
        } })
        .then((res) => {
          DI.get('utils').clearPollingToast(res, 'pairlist')
          commit(SYNC_ASSETS_PAIR, res.assets)
        })
        .catch((message) => {
          DI.get('utils').pollingToast(message, 'pairlist')
        })
    },
    [SYNC_RECOMMEND_ASSET]({ commit }) {
      return DI.get('assetHttp')
        .getRecommendAsset()
        .then((res) => {
          commit(SYNC_RECOMMEND_ASSET, res.recommend_assets)
        })
        .catch(Message)
    },
    [CLEAR_MARKET_INFO]({ commit }) {
      commit(CLEAR_MARKET_INFO)
    },
    [SYNC_MARKET_INFO]({ commit }, param) {
      return DI.get('pairHttp')
        .getMarketsInfo(param.symbol)
        .then((res) => {
          commit(SYNC_MARKET_INFO, res.prices)
        })
        .catch(Message)
    },
    [SYNC_HOT_SEARCH]({ commit }) {
      return DI.get('pairHttp')
        .getHotSearch()
        .then((res) => {
          commit(SYNC_HOT_SEARCH, res)
        })
        .catch(Message)
    },
    [SYNC_SINGLE_ASSETS]({ commit }, param) {
      return DI.get('pairHttp')
        .getPairListV2({ params: {
          assets: param.query
        } })
        .then((res) => {
          commit(SYNC_SINGLE_ASSETS, res.assets[0])
        })
        .catch(Message)
    }
  }
}
