import { DI } from 'core'
import { Message } from 'components'
import Vue from 'vue'

export const SYNC_NOTIFICATION = 'SYNC_NOTIFICATION'
export const READ_NOTIFICATION_BY_ID = 'READ_NOTIFICATION_BY_ID'

// for now just used for home promo dialog, no delete correspond post msg event
export default {
  state: {
    notification: {}
  },
  mutations: {
    [SYNC_NOTIFICATION](state, payload) {
      if (payload.key) {
        const { key, id } = payload
        const notif = state.notification[key]
        for (let i = 0; i < notif.length; i++) {
          if (notif[i].message_id === id) {
            notif.splice(i, 1)
            Vue.set(state.notification, key, notif)
            return
          }
        }
      }
      state.notification = payload
    }
  },
  actions: {
    [SYNC_NOTIFICATION]({ commit }) {
      return DI.get("notificationHttp")
        .getNotification()
        .then(res => {
          commit(SYNC_NOTIFICATION, res)
        })
        .catch(Message)
    },
    [READ_NOTIFICATION_BY_ID]({ commit }, param) {
      const { key, id } = param
      return DI.get("notificationHttp")
        .readNotificationById(id)
        .then(() => {
          commit(SYNC_NOTIFICATION, { key, id })
        })
        .catch(() => {})
    }
  }
}
