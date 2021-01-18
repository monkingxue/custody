const wrapperClassName = 'header-wrapper'
const stickyHeaders = ({
  paddingTop, headerClass
}) => {
  const padTop = paddingTop

  const titleList = document.querySelectorAll(headerClass)
  titleList.forEach((each) => {
    each.dataset.offsetTop = Math.max(each.offsetTop, each.getBoundingClientRect().top)
    each.dataset.offsetHeight = each.offsetHeight
    each.dataset.stylePosition = each.style.position
    each.dataset.styleTop = each.style.top
    each.dataset.styleWidth = each.style.width
    if (Array.from(each.parentNode.classList).indexOf(wrapperClassName) < 0) {
      const wrapper = document.createElement('div')
      wrapper.classList.add(wrapperClassName)
      wrapper.style.height = `${each.offsetHeight}px`
      each.parentNode.insertBefore(wrapper, each)
      wrapper.appendChild(each)
    } else {
      each.dataset.offsetTop = each.parentNode.offsetTop
    }
  })
  const handleScroll = () => {
    titleList.forEach((each, index) => {
      if (each.dataset.offsetTop - padTop <= window.pageYOffset) {
        each.style.position = 'fixed'
        each.style.top = `${padTop}px`
        each.style.width = '100%'
        each.classList.add(`${headerClass.replace('.', '')}-fixed`)

        const next = titleList[index + 1]
        if (next && next.dataset.offsetTop - window.pageYOffset < each.dataset.offsetHeight) {
          each.style.top = `${next.dataset.offsetTop - window.pageYOffset - each.dataset.offsetHeight + padTop}px`
        }
      } else {
        each.style.position = each.dataset.stylePosition
        each.style.top = each.dataset.styleTop
        each.style.width = each.dataset.styleWidth
        each.classList.remove(`${headerClass.replace('.', '')}-fixed`)
      }
    })
  }
  handleScroll()
  const removeListener = () => {
    window.removeEventListener("scroll", handleScroll)
  }
  removeListener()
  window.addEventListener("scroll", handleScroll)
  return removeListener
}
export default stickyHeaders
