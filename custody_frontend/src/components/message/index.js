import { Toast } from 'vant'

const NETWORK_ERROR_MESSAGE_SKIP = 'MESSAGE_SKIP'

export default (message) => {
  if (!message) return
  let msg = message.message || message
  if (!msg) return
  if (msg === NETWORK_ERROR_MESSAGE_SKIP) return
  Toast(msg)
}
