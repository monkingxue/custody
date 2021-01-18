<template>
  <section :class="['bi-info-box', isStock && 'stock-info-box']">
    <ul
      v-if="!isStock"
      class="item-list"
    >
      <li class="one-third">
        <div class="item">
          <span class="label">过去1小时</span>
          <span
            :class="[
              'content din',
              nyCoinInfo.percent_change_1h > 0 ? 'green' : 'orange'
            ]"
          >
            {{ nyCoinInfo.percent_change_1h > 0 ? "+" : "" }}{{ (nyCoinInfo.percent_change_1h * 100) | cutNumber(2) }}%
          </span>
        </div>
        <div class="item">
          <span class="label">过去24小时</span>
          <span
            :class="[
              'content din',
              nyCoinInfo.percent_change_24h > 0 ? 'green' : 'orange'
            ]"
          >
            {{ nyCoinInfo.percent_change_24h > 0 ? "+" : "" }}{{ (nyCoinInfo.percent_change_24h * 100) | cutNumber(2) }}%
          </span>
        </div>
        <div class="item">
          <span class="label">过去1周</span>
          <span
            :class="[
              'content din',
              nyCoinInfo.percent_change_7d > 0 ? 'green' : 'orange'
            ]"
          >
            {{ nyCoinInfo.percent_change_7d > 0 ? "+" : "" }}{{ (nyCoinInfo.percent_change_7d * 100) | cutNumber(2) }}%
          </span>
        </div>
      </li>

      <li class="one-third">
        <div class="item">
          <span class="label">流通市值($)</span>
          <span class="content din">
            {{
              +nyCoinInfo.market_cap_usd
                ? shorthandMoney(nyCoinInfo.market_cap_usd)
                : "--"
            }}
          </span>
        </div>
        <div class="item">
          <span class="label">流通数量({{ base }})</span>
          <span
            v-if="nyCoinInfo.available_supply"
            class="content din no-wrap"
          >
            {{
              +nyCoinInfo.available_supply
                ? `${shorthandMoney(nyCoinInfo.available_supply, false)} ${base}`
                : "--"
            }}
          </span>
        </div>
        <div class="item">
          <span class="label">24H成交额($)</span>
          <span class="content din">
            {{ +nyCoinInfo.volume_usd_24h ? shorthandMoney(nyCoinInfo.volume_usd_24h) : "--" }}
          </span>
        </div>
      </li>

      <li class="one-third mb20">
        <div
          v-if="nyCoinInfo.total_market_cap_usd"
          class="item"
        >
          <div class="chart-gauge">
            <span class="circle_bg" />
            <span
              class="circle circle_green"
              :style="
                `transform: rotate(${chartPercentDeg(marketCapPercent)}deg)`
              "
            />
            <span class="percent din">{{ marketCapPercent ? `${marketCapPercent}%` : "--" }}</span>
          </div>
          <span class="label">
            占全球总市值<br>
            排名No.{{ nyCoinInfo.rank }}
          </span>
        </div>
        <div
          v-if="nyCoinInfo.total_supply"
          class="item"
        >
          <div class="chart-gauge">
            <span class="circle_bg" />
            <span
              class="circle circle_blue"
              :style="`transform: rotate(${chartPercentDeg(supplyPercent)}deg)`"
            />
            <span class="percent din">{{ supplyPercent ? `${supplyPercent}%` : "--" }}</span>
          </div>
          <span class="label">流通率</span>
        </div>
        <div
          v-if="nyCoinInfo.market_cap_usd"
          class="item"
        >
          <div class="chart-gauge">
            <span class="circle_bg" />
            <span
              class="circle circle_yellow"
              :style="
                `transform: rotate(${chartPercentDeg(supplyPercent24h)}deg)`
              "
            />
            <span class="percent din">{{ supplyPercent24h ? `${supplyPercent24h}%` : "--" }}</span>
          </div>
          <span class="label">24H换手率</span>
        </div>
      </li>
    </ul>

    <ul
      v-if="!isStock"
      class="item-list"
    >
      <li class="item-title">
        项目简介
      </li>
      <li>
        <div class="item">
          <span class="label">中文名</span>
          <span class="content">{{ nyCoinInfo.cn_name || "--" }}</span>
        </div>
        <div class="item">
          <span class="label">英文名</span>
          <span class="content">{{ nyCoinInfo.en_name || "--" }}</span>
        </div>
      </li>
      <li>
        <!-- <div class="item">
          <span class="label">发行时间</span>
          <span class="din content">
            2018-11-01
          </span>
        </div> -->
        <div class="item">
          <span class="label">发行总量</span>
          <span
            v-if="nyCoinInfo.total_supply"
            class="din content"
          >
            {{
              +nyCoinInfo.total_supply
                ? `${shorthandMoney(nyCoinInfo.total_supply, false)} ${base}`
                : "--"
            }}
          </span>
        </div>
      </li>
      <!-- <li>
        <div class="item">
          <span class="label">上架交易所</span>
          <span class="din content">18</span>
        </div>
        <div class="item">
          <span class="label">前十交易所</span>
          <span class="din content">8</span>
        </div>
      </li> -->
      <li v-if="description">
        <div :class="['desc-wrap', !checkAllFlag && (description.length > 200) && 'desc-overflow']">
          <span
            v-if="!checkAllFlag && description.length > 200"
            class="all"
            @click="checkAllDesc"
          >
            查看全文
          </span>
          <p>
            {{ description }}
          </p>
        </div>
      </li>
    </ul>

    <!-- stock info -->
    <ul
      v-if="isStock"
      class="item-list"
    >
      <li class="one-third">
        <div class="item">
          <span class="label">52周最高</span>
          <span class="content din">
            {{ +statisticsInfo['52_week_high'] ? shorthandMoney(statisticsInfo['52_week_high']) : "--" }}
          </span>
        </div>
        <div class="item">
          <span class="label">52周最低</span>
          <span class="content din">
            {{ +statisticsInfo['52_week_low'] ? shorthandMoney(statisticsInfo['52_week_low']) : "--" }}
          </span>
        </div>
        <div class="item">
          <span class="label">应付账款周转率</span>
          <span class="content din">
            {{ +statisticsInfo.apturnover ? shorthandMoney(statisticsInfo.apturnover) : "--" }}
          </span>
        </div>
      </li>

      <li class="one-third">
        <div class="item">
          <span class="label">市值</span>
          <span class="content din">
            {{ +statisticsInfo.marketcap ? shorthandMoney(statisticsInfo.marketcap) : "--" }}
          </span>
        </div>
        <div class="item">
          <span class="label">总资产</span>
          <span class="content din">
            {{ +statisticsInfo.totalassets ? shorthandMoney(statisticsInfo.totalassets) : "--" }}
          </span>
        </div>
        <div class="item">
          <span class="label">成交量</span>
          <span class="content din">
            {{ +statisticsInfo.volume ? shorthandMoney(statisticsInfo.volume) : "--" }}
          </span>
        </div>
      </li>

      <li class="one-third">
        <div class="item">
          <span class="label">市净率</span>
          <span class="content din">
            {{ +statisticsInfo.pricetobook ? shorthandMoney(statisticsInfo.pricetobook) : "--" }}
          </span>
        </div>
        <div class="item">
          <span class="label">市盈率</span>
          <span class="content din">
            {{ +statisticsInfo.pricetoearnings ? shorthandMoney(statisticsInfo.pricetoearnings) : "--" }}
          </span>
        </div>
        <div class="item">
          <span class="label">市销率</span>
          <span class="content din">
            {{ +statisticsInfo.pricetorevenue ? shorthandMoney(statisticsInfo.pricetorevenue) : "--" }}
          </span>
        </div>
      </li>
    </ul>
    <ul
      v-if="isStock"
      class="item-list"
    >
      <li class="item-title">
        项目简介
      </li>
      <li class="one-line">
        <div class="item">
          <span class="label">CEO</span>
          <span class="content">{{ companyInfo.ceo || "--" }}</span>
        </div>
      </li>
      <li class="one-line">
        <div class="item">
          <span class="label">总部</span>
          <span class="content">{{ companyInfo.country || "--" }}</span>
        </div>
      </li>
      <li>
        <div class="item">
          <span class="label">创立时间</span>
          <span class="content">{{ companyInfo.founded_date || "--" }}</span>
        </div>
        <div class="item">
          <span class="label">雇员</span>
          <span class="content">{{ companyInfo.employees ? shorthandMoney(companyInfo.employees, false) : "--" }}</span>
        </div>
      </li>
      <li v-if="companyInfo.long_description">
        <div 
          :class="['desc-wrap', !checkAllFlag && (companyInfo.long_description.length > 200) && 'desc-overflow']"
        >
          <span
            v-if="!checkAllFlag && companyInfo.long_description.length > 200"
            class="all"
            @click="checkAllDesc"
          >
            查看全文
          </span>
          <p>
            {{ companyInfo.long_description }}
          </p>
        </div>
      </li>
    </ul>

    <ul
      v-if="!isStock"
      class="item-list"
    >
      <li class="item-title">
        相关网站
      </li>
      <li
        v-for="website in websites"
        :key="website"
        class="one-line"
      >
        <div class="item item-website">
          <span class="label">官方网站</span>
          <span class="content link">
            {{ website }}
          </span>
        </div>
      </li>
      <li
        v-if="nyCoinInfo.white_paper"
        class="one-line"
      >
        <div class="item item-website">
          <span class="label">白皮书</span>
          <span class="content link">
            {{ nyCoinInfo.white_paper }}
          </span>
        </div>
      </li>
      <li
        v-for="(itemLink, index) in explorers"
        :key="itemLink"
        class="one-line"
      >
        <div class="item item-website">
          <span class="label">区块链浏览器{{ index + 1 }}</span>
          <span class="content link">
            {{ itemLink }}
          </span>
        </div>
      </li>
    </ul>
  </section>
</template>
<script>
import { DI } from "core"
import { Message } from "components"

export default {
  props: {
    symbol: String,
    source: String
  },
  data() {
    return {
      nyCoinInfo: {
        available_supply: "",
        total_supply: "",
        price_usd: "",
        market_cap_usd: "",
        volume_usd_24h: "",
        percent_change_1h: "",
        percent_change_24h: "",
        percent_change_7d: ""
      },
      coinInfo: {},
      checkAllFlag: false
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
    },
    marketCapPercent() {
      const nyCoinInfo = this.nyCoinInfo
      return +nyCoinInfo.market_cap_usd
        ? DI.get("filters").cutNumber(
          (nyCoinInfo.market_cap_usd / nyCoinInfo.total_market_cap_usd) * 100,
          2
        )
        : 0
    },
    supplyPercent() {
      const nyCoinInfo = this.nyCoinInfo
      return +nyCoinInfo.available_supply
        ? DI.get("filters").cutNumber(
          (nyCoinInfo.available_supply / nyCoinInfo.total_supply) * 100,
          2
        )
        : 0
    },
    supplyPercent24h() {
      const nyCoinInfo = this.nyCoinInfo
      return +nyCoinInfo.volume_usd_24h && +nyCoinInfo.market_cap_usd
        ? DI.get("filters").cutNumber(
          (nyCoinInfo.volume_usd_24h / nyCoinInfo.market_cap_usd) * 100,
          2
        )
        : 0
    },
    websites() {
      if (
        this.nyCoinInfo &&
        this.nyCoinInfo.websites &&
        this.nyCoinInfo.websites.length
      ) {
        return this.nyCoinInfo.websites.split(",")
      }
      return []
    },
    explorers() {
      if (
        this.nyCoinInfo &&
        this.nyCoinInfo.explorer &&
        this.nyCoinInfo.explorer.length
      ) {
        return this.nyCoinInfo.explorer.split(",")
      }
      return []
    },
    description() {
      return this.nyCoinInfo.description || this.coinInfo.description
    },
    storeStockInfo() {
      return DI.get("store").state.stock.stockInfo
    },
    stockInfo() {
      return this.storeStockInfo[this.base]
    },
    companyInfo() {
      return this.stockInfo && this.stockInfo.company_info ? this.stockInfo.company_info : {}
    },
    statisticsInfo() {
      return this.stockInfo && this.stockInfo.statistics_info ? this.stockInfo.statistics_info : {}
    }
  },
  watch: {
    nyCoinid: {
      immediate: true,
      handler() {
        this.getBiInfo()
      }
    },
    base: {
      immediate: true,
      handler() {
        this.getCoinInfo()
      }
    }
  },
  methods: {
    checkAllDesc() {
      this.checkAllFlag = !this.checkAllFlag
    },
    chartPercentDeg(percent) {
      if (percent) {
        return Math.floor(percent * 1.8 - 135)
      } else {
        return "-135"
      }
    },
    shorthandMoney(money, showWan = true) {
      const moneyInteger = money.toString().split(".")[0]
      if (moneyInteger.length >= 9) {
        return DI.get("filters").formatMoney(money / 100000000, 2) + " 亿"
      } else if (moneyInteger.length >= 5 && showWan) {
        return DI.get("filters").formatMoney(money / 10000, 2) + " 万"
      } else {
        return money.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      }
    },
    async getBiInfo() {
      if (!this.nyCoinid) {
        return
      }
      const nyCoinInfo = await DI.get("niuyan").getBiInfo(this.nyCoinid)
      if (nyCoinInfo.coin_id) {
        this.nyCoinInfo = nyCoinInfo
      }
    },
    getCoinInfo() {
      if (!this.base || this.isStock) {
        return
      }
      DI.get("pairHttp")
        .getCoinInfo(this.base)
        .then(res => {
          this.coinInfo = res
          if (this.isAbtcChart) {
            this.nyCoinInfo = {
              ...this.nyCoinInfo,
              ...res,
              websites: res.site_url,
              white_paper: res.white_paper_url
            }
          }
        })
        .catch(Message)
    }
  }
}
</script>

<style scoped lang="less">
@orange: #ff654c;
@green: #36d58f;
@blue: #009AFF;
@mainText: #222;
@grayText: rgba(34, 34, 34, 0.6);
@lightGrayText: rgba(34, 34, 34, 0.3);
.bi-info-box {
  margin: 15px 0 20px;

  .desc-wrap {
    font-size: 12px;
    margin: 5px 0 10px;
    line-height: 24px;
    color: @mainText;
    text-align: justify;

    .all {
      font-size: 12px;
      color: #00C3D2;
      float: right;
      shape-outside: inset(144px 0px 0px 0px);
      width: 100px;
      height: 168px;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      &::before {
        content: "...";
        color: #222;
        position: relative;
        left: -41px;
      }
    }
    &.desc-overflow {
      max-height: 168px;
      overflow: hidden;
    }
  }
  .item-list {
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 10px;
    margin-bottom: 10px;
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .item-title {
      font-size: 12px;
      height: 38px;
      line-height: 38px;
      font-weight: bold;
      color: @mainText;
    }
    li {
      color: #6c757d;
      display: flex;
      justify-content: space-between;
    }
    .item {
      width: 46%;
      height: 38px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }
    .item-website {
      align-items: flex-start;
    }
    span.label {
      color: @lightGrayText;
    }
    span.content {
      color: @mainText;
      font-weight: bold;
      white-space: normal;
      text-align: right;
      max-width: 70%;
    }
    span.no-wrap {
      white-space: nowrap; 
    }
    span.link {
      // color: #00c3d2;
      font-weight: normal;
    }
    span.orange {
      color: @orange;
    }
    span.green {
      color: @green;
    }
    .one-line {
      .item {
        width: 100%;
      }
      span.content {
        width: 70%;
        text-align: right;
        word-break: break-all;
        white-space: normal;
      }
    }
    .one-third {
      margin: 20px -20px 10px;
      .item {
        height: auto;
        width: 33%;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: flex-start;
      }
      span.label {
        display: flex;
      }
      &.mb20 {
        margin-bottom: 20px;
      }
    }
  }
  .chart-gauge {
    position: relative;
    width: 80px;
    height: 40px;
    overflow: hidden;
    margin-bottom: 5px;

    .percent {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      color: #222;
      font-size: 14px;
    }

    .circle_bg,
    .circle {
      width: 64px;
      height: 64px;
      border: 8px solid transparent;
      border-radius: 50%;
      position: absolute;
      top: 0;
      right: 0;
      transform: rotate(45deg);
    }
    .circle_bg {
      border-left: 8px solid #f3f3f3;
      border-top: 8px solid #f3f3f3;
    }
    .circle_green {
      border-left: 8px solid #36d58f;
      border-top: 8px solid #36d58f;
    }
    .circle_blue {
      border-left: 8px solid #24B0FF;
      border-top: 8px solid #24B0FF;
    }
    .circle_yellow {
      border-left: 8px solid #FDAC57;
      border-top: 8px solid #FDAC57;
    }
    .circle {
      animation-name: circle_rotate;
      animation-duration: 1s;
      animation-timing-function: linear;
    }

    @keyframes circle_rotate {
      0% {
        transform: rotate(-135deg);
      }
    }
  }

  &.stock-info-box {
    .item-list span.green {
      color: @blue;
    }
  }
}
</style>
