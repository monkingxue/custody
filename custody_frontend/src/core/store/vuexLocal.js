import { DI } from 'core'
import debounce from '@kpi/u/debounce'
import dayjs from 'dayjs'

const offlineStorage = DI.get('offlineStorage')

const VUEX_LOCAL = 'VUEX_LOCAL'
const VUEX_LOCAL_TIME = 'VUEX_LOCAL_TIME'

const debouncedUpdate = debounce((state) => {
  try {
    offlineStorage.set(VUEX_LOCAL, JSON.stringify(state))
    offlineStorage.set(VUEX_LOCAL_TIME, +dayjs())
  } catch (e){
  // eslint-disable-line
  }
}, 200)

const VuexLocalStorage = (store) => {
  try {
    let previous = offlineStorage.get(VUEX_LOCAL)
    let previousTime = offlineStorage.get(VUEX_LOCAL_TIME)
    if (previousTime
        && dayjs(previousTime).isValid()
        && dayjs().diff(Number(previousTime), 'd') < 3 // 缓存 3 天过期
    ) {
      if (previous) {
        previous = JSON.parse(previous)
        if (previous) {
          store.replaceState(previous)
        }
      }
    }
  } catch (e){
   // eslint-disable-line
  }

  store.subscribe((mutation, state) => {
    debouncedUpdate(state)
  })

}

export default VuexLocalStorage
