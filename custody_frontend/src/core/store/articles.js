import { DI } from 'core'
import { Message } from 'components'

export const SYNC_ARTICLES = 'SYNC_ARTICLES'
export const SYNC_ARTICLES_LOADING = 'SYNC_ARTICLES_LOADING'
export const SYNC_ARTICLES_LOADMORE = 'SYNC_ARTICLES_LOADMORE'

export default {
  state: {
    articles: [],
    pageIndex: 1,
    loading: false,
    loaded: false
  },
  mutations: {
    [SYNC_ARTICLES_LOADING](state, payload) {
      state.loading = payload
    },
    [SYNC_ARTICLES](state, payload) {
      if (payload.length === 0) {
        state.loaded = true
      } else {
        state.articles = state.articles.concat(payload)
      }
    },
    [SYNC_ARTICLES_LOADMORE](state) {
      state.pageIndex += 1
    }
  },
  actions: {
    [SYNC_ARTICLES]({ commit, state }, param) {
      const pageIndex = param && param.pageIndex ? param.pageIndex : state.pageIndex
      if (param && param.pageIndex && (param.pageIndex < state.pageIndex)) return
      if (state.articles.length && pageIndex === 1) return
      if (state.loading) return
      if (state.loaded) return
      commit(SYNC_ARTICLES_LOADING, true)
      return DI.get("pairHttp")
        .getArticles(pageIndex)
        .then(res => {
          commit(SYNC_ARTICLES, res)
        })
        .catch(Message)
        .then(() => {
          commit(SYNC_ARTICLES_LOADING, false)
        })
    },
    [SYNC_ARTICLES_LOADMORE]({ commit }) {
      commit(SYNC_ARTICLES_LOADMORE)
    }
  }
}
