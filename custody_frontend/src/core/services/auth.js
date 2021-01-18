import DI from '@kpi/di'

const NETWORK_ERROR_MESSAGE = '网络错误，请刷新页面后重试'
const NETWORK_ERROR_MESSAGE_SKIP = 'MESSAGE_SKIP'
const NIUYAN_URL = 'niuyan_'
let networkErrorMessage = NETWORK_ERROR_MESSAGE

// 一定时间内 不重复报网络失败的错
const pauseErrorMessage = () => {
  networkErrorMessage = NETWORK_ERROR_MESSAGE_SKIP
  setTimeout(() => {
    // 故意这么改的 不显示 NETWORK_ERROR_MESSAGE 了
    // 这样网络错误不会报给用户
    networkErrorMessage = NETWORK_ERROR_MESSAGE_SKIP
  }, 1000 * 30)
}
export default class Auth {

  constructor() {
    this.offlineStorage = DI.get('offlineStorage')
    const backendHttps = [
      { name: 'main', source: DI.get('baseMainHttp') }
    ]

    backendHttps.forEach((http) => {
      http.source.getInstance().interceptors.request.use((config) => {
        const configs = config
        if (!config.timeout) configs.timeout = 10000
        if (config.url.indexOf(NIUYAN_URL) < 0) {
          // niuyan
          configs.headers["access-token"] = this.getToken().token
        }
        return configs
      })

      http.source.getInstance().interceptors.response.use((response) => {

        if (
          response &&
          response.config &&
          response.config.url.indexOf(NIUYAN_URL) >= 0
        ) {
          // niuyan
          return response.data || response
        }
        if (response && response.data) {
          const { skipLoginRedirect } = response.config
          const { status, error } = response.data
          if (status === 'ok') {
            return response.data.data
          } else if (status === 'fail') {
            if (error && error.code) {
              const { code } = error
              if (code === "10002") { // 401
                if (skipLoginRedirect) {
                  return Promise.reject()
                }
                this.clear()
                DI.get('router').push({ path: '/login' })
                return Promise.reject(error)
              }
            }
            return Promise.reject(error)
          }
        }
        Promise.reject(response)
      }, (error) => {
        if (error && error.response) {
          let message = ''
          if (error.response.status >= 500) {
            message = '500 服务器维护中，请稍候再试'
          } else {
            message = error.response.data ? error.response.data.message : error.response.statusText
          }
          return Promise.reject({ message, error })
        }
        if (!error.response || !error.response.data) {
          pauseErrorMessage()
          const message = networkErrorMessage
          return Promise.reject({ message, error })
        }
        return Promise.reject({ error })
      })
    })
  }

  clear() {
    this.offlineStorage.remove('token')
    this.offlineStorage.remove('id')
  }

  getToken() {
    return {
      token: this.offlineStorage.get('token'),
      id: this.offlineStorage.get('id')
    }
  }

  setToken(id ,token) {
    this.offlineStorage.set('id', id)
    this.offlineStorage.set('token', token)
  }

  isAuthenticated() {
    return !!this.getUser().identity
  }

  isRealnameVerified() {
    return this.getUser().id_card_status === 'success'
  }

  getUserSecurityLevel() {
    // 高：2 资金密码+身份认证+指纹锁
    // 中：1 资金密码+身份认证
    // 低：0
    if (
      DI.get("utils").isFromApp() &&
      window.biometryEnabled &&
      this.getUser().set_fund_password &&
      this.getUser().set_card_number
    ) {
      return DI.get("CUSTOMER_SECURITY_LEVEL")[2]
    } else if (
      this.getUser().set_fund_password &&
      this.getUser().set_card_number
    ) {
      return DI.get("CUSTOMER_SECURITY_LEVEL")[1]
    } else {
      return DI.get("CUSTOMER_SECURITY_LEVEL")[0]
    }
  }

  getUser() {
    return DI.get('store').state.auth.auth
  }

  syncUser() {
    DI.get('store').dispatch('SYNC_AUTH')
  }

  logout() {
    this.clear()
    DI.get('store').commit('RESET_AUTH')
    DI.get('store').commit('RESET_YUBIBAO_BALANCE')
  }
}
