<script>
import { DI } from 'core'
import { Message } from 'components'
import fetchBlobXHR from '@kpi/u/fetchBlobXHR'
import fileToBase64 from '@kpi/u/fileToBase64'

const USER_AVATAR_CACHE = 'USER_AVATAR_CACHE'
let caching = false

export default {
  watch: {
    account: {
      immediate: true,
      handler(val) {
        if (
          val.small_avatar &&
          !caching &&
          !DI.get('offlineStorage').get(USER_AVATAR_CACHE)
        ) {
          this.cacheAvatar()
        }
      }
    }
  },
  methods: {
    removeCache() {
      DI.get('offlineStorage').remove(USER_AVATAR_CACHE)
    },
    cacheAvatar() {
      caching = true
      this.removeCache()
      fetchBlobXHR(`${this.account.small_avatar}?t=${Date.now()}`)
        .then(blob => fileToBase64(blob))
        .then((base64) => {
          DI.get('offlineStorage').set(USER_AVATAR_CACHE, base64)
        })
        .catch(Message)
        .then(() => {
          caching = false
        })
    }
  }
}
</script>
