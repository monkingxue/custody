import { DI } from 'core'
import { Message } from 'components'

export const SYNC_YUBIBAO_BALANCE = 'SYNC_YUBIBAO_BALANCE'
export const RESET_YUBIBAO_BALANCE = 'RESET_YUBIBAO_BALANCE'
export const SYNC_YUBIBAO_SETTING = 'SYNC_YUBIBAO_SETTING'
export const SYNC_YUBIBAO_CONTRACT = 'SYNC_YUBIBAO_CONTRACT'

export default {
  state: {
    balance: {},
    setting: [],
    contract: {}
  },
  mutations: {
    [SYNC_YUBIBAO_BALANCE](state, payload) {
      state.balance = payload
    },
    [RESET_YUBIBAO_BALANCE](state) {
      state.balance = {}
    },
    [SYNC_YUBIBAO_SETTING](state, payload) {
      state.setting = payload
    },
    [SYNC_YUBIBAO_CONTRACT](state, payload) {
      state.contract = payload
    }
  },
  actions: {
    [SYNC_YUBIBAO_BALANCE]({ commit }) {
      return DI.get("yubibaoHttp")
        .getBalance()
        .then(res => {
          commit(SYNC_YUBIBAO_BALANCE, res)
        })
        .catch(Message)
    },
    [SYNC_YUBIBAO_SETTING]({ commit }) {
      return DI.get("yubibaoHttp")
        .getCoinSetting()
        .then(res => {
          commit(SYNC_YUBIBAO_SETTING, res)
        })
        .catch(Message)
    },
    [RESET_YUBIBAO_BALANCE]({ commit }) {
      commit(RESET_YUBIBAO_BALANCE)
    },
    [SYNC_YUBIBAO_CONTRACT]({ commit }) {
      return DI.get("yubibaoHttp")
        .getContract()
        .then(res => {
          commit(SYNC_YUBIBAO_CONTRACT, res)
        })
        .catch(Message)
    }
  }
}
