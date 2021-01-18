import { DI } from 'core'
import { Message } from 'components'
import Vue from 'vue'

export const SYNC_STOCK_LIST = 'SYNC_STOCK_LIST'
export const SYNC_STOCK_INFO = 'SYNC_STOCK_INFO'
export const SYNC_MULTIPLE_PRICE = 'SYNC_MULTIPLE_PRICE'
export const SYNC_SINGLE_PRICE = 'SYNC_SINGLE_PRICE'
export const SYNC_LIST_LOADING = 'SYNC_LIST_LOADING'
export const SYNC_LIST_LOADMORE = 'SYNC_LIST_LOADMORE'
export const STOCK_PAGE_SIZE = 20

export default {
  state: {
    stockList: [],
    stockListPage: 1,
    stockListLoading: false,
    stockListLoaded: false,
    stockInfo: {},
    stockObj: {}
  },
  mutations: {
    [SYNC_STOCK_LIST](state, payload) {
      if (payload.length === 0) {
        state.stockListLoaded = true
        return
      }
      if (payload.length < STOCK_PAGE_SIZE) {
        state.stockList = state.stockList.concat(payload)
        state.stockListLoaded = true
        return
      }
      state.stockList = state.stockList.concat(payload)
    },
    [SYNC_LIST_LOADING](state, payload) {
      state.stockListLoading = payload
    },
    [SYNC_LIST_LOADMORE](state) {
      state.stockListPage += 1
    },
    [SYNC_STOCK_INFO](state, payload) {
      Vue.set(state.stockInfo, payload.symbol, payload.res)
    },
    [SYNC_MULTIPLE_PRICE](state, payload) {
      // no use
      state.stockList = state.stockList.map((oldItem) => {
        const newItem = payload.find((i) => i.symbol === oldItem.symbol)
        if (newItem) return newItem
        return oldItem
      })
    },
    [SYNC_SINGLE_PRICE](state, payload) {
      Vue.set(state.stockObj, payload.symbol, payload)
    }
  },
  actions: {
    [SYNC_STOCK_LIST]({ commit, state }) {
      if (Math.ceil(state.stockList.length / STOCK_PAGE_SIZE) === state.stockListPage) return
      if (state.stockListLoading) return
      if (state.stockListLoaded) return
      commit(SYNC_LIST_LOADING, true)
      return DI.get('stockHttp')
        .getStockList(state.stockListPage)
        .then((res) => {
          commit(SYNC_STOCK_LIST, res.stocks)
        })
        .catch(Message)
        .then(() => {
          commit(SYNC_LIST_LOADING, false)
        })
    },
    [SYNC_LIST_LOADMORE]({ commit }) {
      commit(SYNC_LIST_LOADMORE)
    },
    [SYNC_STOCK_INFO]({ commit }, param) {
      return DI.get('stockHttp')
        .getStockInfo(param)
        .then((res) => {
          commit(SYNC_STOCK_INFO, { symbol: param, res })
        })
        .catch(Message)
    },
    [SYNC_MULTIPLE_PRICE]({ commit }, param) {
      // no use
      return DI.get('stockHttp')
        .getMultipleStockPrice(param)
        .then((res) => {
          DI.get('utils').clearPollingToast(res, 'stocklist')
          commit(SYNC_MULTIPLE_PRICE, res.stocks)
        })
        .catch((message) => {
          DI.get('utils').pollingToast(message, 'stocklist')
        })
    },
    [SYNC_SINGLE_PRICE]({ commit }, param) {
      return DI.get('stockHttp')
        .getMultipleStockPrice(param)
        .then((res) => {
          commit(SYNC_SINGLE_PRICE, res.stocks[0])
        })
        .catch(Message)
    }
  }
}
