import { DI } from 'core'

export default class NotificationHttp {
  getNotification() {
    return DI.get('baseMainHttp').get('/messages')
  }

  readNotificationById(id) {
    return DI.get('baseMainHttp').post('/message', { message_id: id })
  }
}
