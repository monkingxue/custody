import DI from '@kpi/di'

export default class Bridge {

  constructor() {
    this.init()
  }

  init() {
    window.appGetAccountIdentity = () => {
      return DI.get('auth').getUser().identity
    }

    window.appGetAccessToken = () => {
      return DI.get('auth').getToken()
    }
  }

}

