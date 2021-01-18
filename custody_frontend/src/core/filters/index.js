export function cutNumber(number, tail = 2) {
  if (number === null) return
  number = Number(number)
  if (number === 0) return number
  if (number.toString().indexOf('.') === -1) {
    return number.toFixed(tail)
  }
  const numberArr = number.toString().split('.')
  if (numberArr[1].length < tail) {
    return number.toFixed(tail)
  }
  numberArr[1] = numberArr[1].substring(0, tail)
  return numberArr[1] ? numberArr.join('.') : numberArr.join('')
}

export function formatPercent(percent) {
  if (percent) {
    return cutNumber(percent, 2)
  }
  return '0.00'
}

export function formatMoney(money) {
  if (money) {
    return `${cutNumber(money, 2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
  }
  return '0.00'
}

export function cutString(string, length) {
  if (string.length > length) {
    return string.substring(0, length)
  }
  return string
}

export function formatMobile(m) {
  if (!m) {
    return ''
  }
  const s = String(m)
  return `${s.substr(0, 3)}${s.slice(3, -4).replace(/./g, '*')}${s.substr(-4)}`
}

export function maxDecimal(number, maxLen) {
  const numString = String(number)
  if (numString.indexOf('.') > -1) {
    const num = numString.split('.')[1]
    if (num.length > maxLen) {
      return Number(Number(number).toFixed(maxLen))
    }
  }
  return number
}

export function getMaxDecimalNum(num, max) {
  const str = '' + num
  if (+num === 0) {
    return 0
  }
  if (str.indexOf("e") > -1) {
    const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
    return num.toFixed(Math.min(max, (m[1] || "").length - m[2]))
  } else if (str.indexOf(".") > -1) {
    const decimal = str.split(".")[1]
    return Number(num).toFixed(Math.min(max, decimal.length))
  }
  return num
}

export function toFixed(number, fixed) {
  const num = number || 0
  return Number(num).toFixed(fixed)
}

// return 1,234.56 亿
export function shorthandMoney(money, showWan = true) {
  if (!money) {
    return money
  }
  const moneyInteger = money.toString().split(".")[0]
  if (moneyInteger.length >= 9) {
    return formatMoney(money / 100000000, 2) + " 亿"
  } else if (moneyInteger.length >= 5 && showWan) {
    return formatMoney(money / 10000, 2) + " 万"
  } else if (moneyInteger.length >= 4) {
    return formatMoney(money, 2)
  } else {
    return money
  }
}

// 处理浮点运算精度
export function strip (num, precision = 12) {
  if (precision < 2) precision = 2 // 17.561081302803156 toPrecision(1) = 20 不对
  return +parseFloat(Number(num || 0).toPrecision(precision))
}
