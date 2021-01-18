import { DI } from 'core'

export default class AuthHttp {
  getSmsCode(data) {
    return DI.get('baseMainHttp').post('customer/login/code', data)
  }

  loginBySmsCode(data) {
    return DI.get('baseMainHttp').post('customer/login', data)
  }

  saveProfile(data){
    return DI.get('baseMainHttp').post('customer/profile', data)
  }

  saveAvatar(data){
    return DI.get('baseMainHttp').post('avatar/upload', data)
  }

  getAccountDetail(id) {
    return DI.get('baseMainHttp').get(`customer/${id}`)
  }
}
