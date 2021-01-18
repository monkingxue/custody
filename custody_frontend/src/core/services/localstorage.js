const localStorage = window.localStorage

export default class OfflineStorage {
  set(key, value) {
    localStorage.setItem(key, value)
    return this
  }

  get(key, defaultValue = null) {
    return localStorage.getItem(key) || defaultValue
  }

  remove(key) {
    localStorage.removeItem(key)
    return this
  }

  has(key) {
    return !!this.get(key)
  }

}
