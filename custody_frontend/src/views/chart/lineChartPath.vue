<script>
import { DI } from "core"
const CHART_BOX_WIDTH = window.innerWidth - 10
const CHART_BOX_HEIGHT = 300
const CHART_HEIGHT = 240

const CHART_SMALL_WIDTH = 90
const CHART_SMALL_HEIHGT = 30

export default {
  data() {
    return {
      chartBoxWidth: CHART_BOX_WIDTH,
      chartBoxHeight: CHART_BOX_HEIGHT,
      crossHairHeight: CHART_HEIGHT + 20,

      chartLoaded: false,
      chartData: [],

      chartFilterCur: "1d",

      linePath: "",
      lineAreaPath: "",

      maxInfo: {
        x: "",
        y: "",
        price: ""
      },
      minInfo: {
        x: "",
        y: "",
        price: ""
      },

      positionMap: new Map(),
      range: {}
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    base() {
      return this.symbol ? DI.get("utils").getBaseFromSymbol(this.symbol) : ""
    },
    nyCoinid() {
      return this.biInfo && this.base && this.biInfo[this.base]
        ? this.biInfo[this.base]["ny_coinid"]
        : ""
    },
    isAbtcChart() {
      return this.nyCoinid === 'abtc_chart'
    },
    isStock() {
      return this.source === 'STOCK'
    }
  },
  watch: {
    nyCoinid: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getLineChart("1d")
        }
      }
    },
    source: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getLineChart("1d")
        }
      }
    },
    base: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getLineChart("1d")
        }
      }
    }
  },
  methods: {
    async getLineChart(type) {
      if (!this.nyCoinid && !this.isStock) {
        return
      }
      if (!this.base && this.isStock) {
        return
      }
      let res
      if (this.isAbtcChart) {
        res = await DI.get("niuyan").getABTCLineChart(this.symbol, type)
      } else if (this.isStock) {
        res = await DI.get("niuyan").getStockLineChart(this.base, type)
      } else {
        res = await DI.get("niuyan").getNYLineChart(this.nyCoinid, type)
      }
      if (res.data && res.data.length && type === this.chartFilterCur) {
        this.chartData = res.data
        this.range = res.range
        this.generatePath()
      } else if (type === this.chartFilterCur) {
        this.chartLoaded = true
      }
    },
    generatePath() {
      if (!this.chartData.length) {
        return
      }
      this.positionMap.clear()

      const step = DI.get("filters").cutNumber(
        CHART_BOX_WIDTH / this.chartData.length
      )
      const { usdMax, usdMin } = this.range

      /**
       * small linechart path of pairPrice fixedNav
       */
      const chartSmallSpace = Math.ceil(
        this.chartData.length / 20
      )
      const stepSmall = DI.get("filters").cutNumber(
        CHART_SMALL_WIDTH / (this.chartData.length / chartSmallSpace)
      )

      this.linePath = "M0,"
      let linePathSmall = "M0,"
      let lastCurX = CHART_BOX_WIDTH

      this.chartData.forEach((item, i) => {
        const timestamp = item[0]
        const usdPrice = item[1]

        // calculate lineto xy
        const curX = Math.floor(step * i)
        const curY = DI.get("filters").cutNumber(
          ((usdMax - usdPrice) * CHART_HEIGHT) / (usdMax - usdMin),
          6
        )
        if (i === 0) {
          this.linePath += curY
        } else {
          this.linePath += `L${curX},${curY}`
        }
        if (i % chartSmallSpace === 0 || usdMax === usdPrice || usdMin === usdPrice) {
          const curSmallX = Math.floor(stepSmall * (i / chartSmallSpace))
          const curSmallY = DI.get("filters").cutNumber(
            ((usdMax - usdPrice) * CHART_SMALL_HEIHGT) / (usdMax - usdMin),
            2
          )
          linePathSmall +=
            i === 0 ? curSmallY : `L${curSmallX},${curSmallY}`
        }
        if (i === this.chartData.length - 1) {
          lastCurX = curX
        }

        // generate position map
        this.positionMap.set(curX, {
          x: curX,
          y: curY,
          time:
            this.chartFilterCur === "all"
              ? this.$dayjs.unix(timestamp).format("YY-MM-DD")
              : this.$dayjs.unix(timestamp).format("MM-DD HH:mm"),
          price: usdPrice
        })

        // mark max|min position info
        if (usdMax === usdPrice) {
          this.maxInfo = {
            x: curX,
            y: curY,
            price: usdPrice
          }
        }
        if (usdMin === usdPrice) {
          this.minInfo = {
            x: curX,
            y: curY,
            price: usdPrice
          }
        }
      })

      this.lineAreaPath = `${this.linePath}L${lastCurX},${this.crossHairHeight}L0,${this.crossHairHeight}`
      const lineAreaPathSmall = `${linePathSmall}L${CHART_SMALL_WIDTH},${CHART_BOX_HEIGHT}L0,${CHART_BOX_HEIGHT}`
      DI.get("vue").$emit("set-linechart-path", ({ linePathSmall, lineAreaPathSmall }))
      this.chartLoaded = true
    }
  }
}
</script>
