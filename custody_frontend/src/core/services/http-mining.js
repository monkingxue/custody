import { DI } from 'core'

export default class MiningHttp {
  getBountyTasks() {
    return DI.get('baseMainHttp').get('/bounty_task')
  }

  postBountyTask(data) {
    return DI.get('baseMainHttp').post('/bounty_task', data)
  }

  getBountyBalance() {
    return DI.get('baseMainHttp').get('/bounty_balance')
  }

  postTransferBounty(data) {
    return DI.get('baseMainHttp').post('/transfer_bounty', data)
  }
}
