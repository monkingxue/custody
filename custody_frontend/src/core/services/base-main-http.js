import Http from './http'

const testUrl = 'https://api.abtc.one/'
// const testUrl = 'http://api.bao2ye.one:15001'

let baseURL = {
  development: testUrl,
  production: 'https://api.abtc.one/'
}[process.env.NODE_ENV]

const hostName = window.location.hostname

// && hostName.split('.')[0] !== 'onebtc4' 本来这个地址是请求线上的 暂时用不上
if (hostName.indexOf('iamkun') > -1 ) {
  baseURL = testUrl
}

export default class BaseMainHttp extends Http {

  constructor() {
    super({
      baseURL: baseURL
    })
  }

}
