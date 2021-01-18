import DI from "@kpi/di"
import { Message } from "components"

const CACHE_TIME_CHART = {
  type_1d: "60",
  type_7d: "60",
  type_1m: "60",
  type_3m: "3600",
  type_1y: "3600",
  type_all: "3600"
}
const CACHE_TIME_INFO = 60
const getKey = (coin, type) => `${coin}_${type}`

export default class Niuyan {
  constructor() {
    this.chart = {}
    this.info = {}
  }
  // abtc line chart, 后面可以考虑从 niuyan 移出来
  async getABTCLineChart(symbol, type) {
    return await this.getLineChart(symbol, type,
      async () => ({ data: await DI.get("pairHttp").getPairChart(symbol, type) }))
  }
  // stock line chart
  async getStockLineChart(symbol, type) {
    return await this.getLineChart(symbol, type,
      async () => ({ data: await DI.get("stockHttp").getStockChart(symbol, type) }))
  }

  // niuyan line chart
  async getNYLineChart(coin, type) {
    return await this.getLineChart(coin, type,
      async () => (await DI.get("pairHttp").getNiuyanCoinChart(coin, type)))
  }

  async getLineChart(coin, type, fetchMethod) {
    if (this.chart[getKey(coin, type)]) {
      const chart = this.chart[getKey(coin, type)]
      const now = Date.now()
      if (Math.floor(now - chart.timestamp) / 1000 < chart.validTime) {
        return chart
      }
    }

    try {
      const resData = await fetchMethod()
      if (resData.data) {
        return this.getRangePrice(coin, type, resData.data)
      } else {
        Message(resData.msg || resData)
        return resData
      }
    } catch (error) {
      Message(error.msg || error)
      return ""
    }
  }

  getRangePrice(coin, type, resData) {
    let usdMax = "",
      usdMin = ""

    resData.data.forEach(item => {
      const price = item[1]
      if (!usdMax || +price > +usdMax) {
        usdMax = price
      }
      if (!usdMin || +price < +usdMin) {
        usdMin = price
      }
    })
    this.chart[getKey(coin, type)] = Object.assign(resData, {
      range: { usdMax, usdMin },
      timestamp: Date.now(),
      validTime: CACHE_TIME_CHART[`type_${type}`]
    })
    return this.chart[getKey(coin, type)]
  }

  async getBiInfo(coin) {
    if (this.info[coin]) {
      const info = this.info[coin]
      const now = Date.now()
      if (Math.floor(now - info.timestamp) / 1000 < info.validTime) {
        return info["coin"]
      }
    }

    try {
      const res = await DI.get("pairHttp").getNiuyanCoinInfo(coin)

      if (res.data && res.data.coin) {
        this.info[coin] = Object.assign(res.data, {
          timestamp: Date.now(),
          validTime: CACHE_TIME_INFO
        })
        return this.info[coin]["coin"]
      } else {
        Message(res.msg || res)
        return res
      }
    } catch (error) {
      Message(error.msg || error)
      return ""
    }
  }
}
