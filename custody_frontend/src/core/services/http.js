import axios from 'axios'

export default class Http {

  constructor(configs) {
    this.instance = axios.create(configs)
  }

  get(url, configs) {
    return this.instance.get(url, configs)
  }

  post(url, data, configs) {
    return this.instance.post(url, data, configs)
  }

  put(url, data, configs) {
    return this.instance.put(url, data, configs)
  }

  delete(url, configs) {
    return this.instance.delete(url, configs)
  }

  getInstance() {
    return this.instance
  }

}

