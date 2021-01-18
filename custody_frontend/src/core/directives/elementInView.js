import throttle from '@kpi/u/throttle'
import elementInView from '@kpi/u/elementInView'
const scope = 'elementInView'

const onScroll = (el, binding) => {
  const cb = binding.value
  if (elementInView(el)) {
    cb()
  }
}

const throttleOnScroll = (el, binding) => (throttle(onScroll.bind(this, el, binding), 10))

export default {
  name: 'elementInView',
  inserted(el, binding) {
    let onScrollFunc = throttleOnScroll(el, binding)
    el[scope] = { onScrollFunc }
    if (document.querySelector('#app')) {
      document.querySelector('#app').addEventListener('scroll', onScrollFunc)
    }
    window.addEventListener('scroll', onScrollFunc)
  },
  unbind(el) {
    const { onScrollFunc } = el[scope]
    if (document.querySelector('#app')) {
      document.querySelector('#app').removeEventListener('scroll', onScrollFunc)
    }
    window.removeEventListener('scroll', onScrollFunc)
  }
}
