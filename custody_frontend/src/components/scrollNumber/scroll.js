export default class ScrollFn {
  constructor(config) {
    this.setting = config
    this.$parent = config.el
    this.current = config.number
    this.html = (o) => `<span class="number-animate-dom" data-num="{{num}}" style="width:${o === '.' ? this.setting.width / 2 : this.setting.width}px">
                      <span class="number-animate-span">0</span>
                      <span class="number-animate-span">1</span>
                      <span class="number-animate-span">2</span>
                      <span class="number-animate-span">3</span>
                      <span class="number-animate-span">4</span>
                      <span class="number-animate-span">5</span>
                      <span class="number-animate-span">6</span>
                      <span class="number-animate-span">7</span>
                      <span class="number-animate-span">8</span>
                      <span class="number-animate-span">9</span>
                      <span class="number-animate-span">0</span>
                      <span class="number-animate-span">.</span>
                    </span>`
    this.init()
  }
  init() {
    this.$parent.innerHTML = this.setNumDom(this.numToArr(this.setting.num))
    this.animate()
    this.checkFont()
  }
  checkFont() {
    const $dom = this.$parent.querySelector(".number-animate-dom")
    const originHeight = $dom.offsetHeight
    const intervalId = setInterval(() => {
      if ($dom.offsetHeight !== originHeight) {
        this.animate()
        clearInterval(intervalId)
      }
    }, 100)
    setTimeout(() => {
      clearInterval(intervalId)
    }, 1000 * 10) // 10s 字体也应该加载出来了
  }
  animate(setAnimated = false) {
    let $dom = this.$parent.querySelectorAll(".number-animate-dom")
    for (let o of $dom) {
      if (setAnimated) o.classList.add("animated")
      let num = o.getAttribute("data-num")
      num = (num == 0) ? 10 : num
      this._height = o.offsetHeight / 12
      o.style["transform"] = o.style["-webkit-transform"] =
        "translateY(" +
        (num == "." ? -11 * this._height : -num * this._height) +
        "px)"
    }
  }
  setNumDom(arrStr) {
    const { height, useDin } = this.setting
    const heightH = height * ( useDin ? 1.1 : 1 )
    let shtml = `<span class="number-animate" style="font-size:${height}px;height:${heightH}px">`
    arrStr.forEach((o, i) => {
      if (
        i != 0 &&
        (arrStr.length - i) % 3 == 0 &&
        this.setting.symbol &&
        o != "."
      ) {
        shtml +=
          '<span class="number-animate-dot"><span>' +
          this.setting.symbol +
          "</span></span>" +
          this.html().replace("{{num}}", o)
      } else {
        shtml += this.html(o).replace("{{num}}", o)
      }
    })
    shtml += "</span>"
    return shtml
  }
  update(num, el) {
    this.$parent = el
    let newArr = this.numToArr(num)
    let $dom = this.$parent.querySelectorAll(".number-animate-dom")
    const oldIndex = String(this.current).indexOf('.')
    this.current = num
    const newIndex = String(this.current).indexOf('.')
    if ($dom.length !== newArr.length || oldIndex !== newIndex) {
      this.$parent.innerHTML = this.setNumDom(this.numToArr(num))
    } else {
      [].forEach.call($dom, (o, i) => {
        o.setAttribute("data-num", newArr[i])
      })
    }
    this.animate(true)
  }
  numToArr(num) {
    return typeof num === "number" ? num.toString().split("") : num.split("")
  }
}
