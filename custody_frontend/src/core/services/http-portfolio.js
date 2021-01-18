import { DI } from 'core'

export default class PortfolioHttp {
  getPlan() {
    return DI.get('baseMainHttp').get('/invest_plan')
  }

  createPlan(data) {
    return DI.get('baseMainHttp').post('/invest_plan', data)
  }

  updatePlan(data) {
    return DI.get('baseMainHttp').post('/invest_plan/update', data)
  }

  cancelPlan(data) {
    return DI.get('baseMainHttp').post('/invest_plan/cancel', data)
  }
}
