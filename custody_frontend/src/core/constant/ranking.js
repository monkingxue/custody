export const RANKING_LABEL_DATA = {
  hotSearch: {
    type: "hotSearch",
    showIndex: true,
    endpoint: "/v2/hot_search_ranking",
    filedsName: ["币种", "价格", "涨跌幅"],
    filedsClass: ["col-bi", "col-price", "col-value"],
    label: "币圈热搜",
    icon: require("../../assets/images/biz/bang-hot.png"),
    iconLarge: require("../../assets/images/rank/hotSearch.png"),
    bgColor: "#FF654C",
    title: "币圈热搜",
    subTitle: "汇集行情网站上今日最热门的币种",
    desc: `热搜榜汇集了各家行情网站上用户搜索最多的币种。\r\r
用户搜索频率，一定程度反应了某币种近期的项目发展速度或者社群活跃度，您可以通过观察热搜榜，把握投资机会。`
  },
  marketValue: {
    type: "marketValue",
    showIndex: true,
    endpoint: "/v2/market_value_ranking?page_size=50",
    filedsName: ["币种", "价格", "市值 (USD)"],
    filedsClass: ["col-bi", "col-price col-price-slim", "col-value col-value-wide"],
    label: "Top 50 市值榜",
    icon: require("../../assets/images/biz/bang-top50.png"),
    iconLarge: require("../../assets/images/rank/marketValue.png"),
    bgColor: "#4C93FF",
    title: "市值榜",
    subTitle: "数字货币的美元总价值排行榜",
    desc: `币种的市值 = 币种的法币价格 * 流通数量。\r\r
一般长年保持在市值榜单前列的币种，代表它们拥有更高的稳定性，适合长期持有或者定投。若您看好某币种，而它却在市值榜靠后的位置，说不定它未来就有很大的成长空间。`
  },
  tradeVolume: {
    type: "tradeVolume",
    showIndex: true,
    endpoint: "/v2/trade_volume_ranking",
    filedsName: ["币种", "价格", "24h成交额(USD)"],
    filedsClass: ["col-bi", "col-price col-price-slim", "col-value col-value-wide"],
    label: "成交额榜单",
    icon: require("../../assets/images/biz/bang-trade.png"),
    iconLarge: require("../../assets/images/rank/tradeVolume.png"),
    bgColor: "#C520FF",
    title: "成交额榜",
    subTitle: "24小时数字货币的成交额排行榜",
    desc: `成交额 = 成交均价 * 成交量。\r\r
人们常说的“成交量”其实是指“成交额”，24小时成交额可以说明市场的活跃度和资金规模，更是多种技术分析中必不可少的指标。`
  },
  priceChange: {
    type: "priceChange",
    showIndex: true,
    endpoint: "/v2/price_change_ranking",
    filedsName: ["币种", "价格", "涨跌幅"],
    filedsClass: ["col-bi", "col-price", "col-value"],
    label: "涨跌幅榜",
    icon: require("../../assets/images/biz/bang-change.png"),
    iconLarge: require("../../assets/images/rank/priceChange.png"),
    bgColor: "#22CFBB",
    title: "涨跌幅榜",
    subTitle: "汇集24小时内涨幅和跌幅最大的币种",
    desc: `涨幅榜排名靠前的币种，通常是名不见经传的小币种，如果您对项目了解，不妨将其列入关注，等待入场时机。\r\r
如果市值靠前且您熟知的币出现在跌幅榜，说不定会是不错的入场机会。`,
    tabfileds: {
      up: "涨幅榜",
      down: "跌幅榜"
    }
  },
  platformCoin: {
    type: "platformCoin",
    showIndex: false,
    endpoint: "/v2/platform_coin_ranking",
    filedsName: ["币种", "价格", "涨跌幅"],
    filedsClass: ["col-bi", "col-price", "col-value"],
    label: "平台币",
    icon: require("../../assets/images/biz/bang-coin.png"),
    iconLarge: require("../../assets/images/rank/platformCoin.png"),
    bgColor: "#F3BA2F",
    title: "平台币",
    subTitle: "汇集各家主流交易所的平台币",
    desc: `主流交易所的平台币一直备受用户青睐，在 aBTC 可以一次性看多个平台币信息，交易多个平台币。`
  },
  ieo: {
    type: "ieo",
    showIndex: false,
    filedsName: [],
    filedsClass: [],
    label: "最新IEO",
    icon: require("../../assets/images/biz/bang-ieo.png"),
    iconLarge: require("../../assets/images/rank/ieo.png"),
    bgColor: "#633AFF",
    title: "IEO",
    subTitle: "汇集各家交易所最优质的IEO项目",
    desc: `IEO 榜会选择最优质的 IEO 项目展示给您，也会提醒您近期即将上线的IEO。`
  },
  otcPremium: {
    type: "otcPremium",
    showIndex: false,
    endpoint: "/v2/otc_premium",
    filedsName: [],
    filedsClass: [],
    label: "场外溢价",
    icon: require("../../assets/images/biz/bang-otc.png"),
    iconLarge: require("../../assets/images/rank/otcPremium.png"),
    bgColor: "#4DC7FF",
    title: "场外溢价",
    subTitle: "溢价说明",
    desc: `场外溢价 =（场外价格/场内价格 - 1）* 100%\r\r
场外价格：指的是买卖双方直接进行法币兑换数字货币、或者数字货币之间的兑换。该行为只牵扯到买卖双方，所以不会对市场币价造成直接影响。双方约定好交易的价格就是“场外价格”。\r\r
场内价格：在交易所中进行币币交易的成交价称作“场内价格”，每一笔交易都会对当前的市场币价产生影响。\r\r
场外溢价程度反映了增量资金入场意愿的强度。溢价增大，反映投资者入场意愿增强，对后市看涨为主；反之，投资者入场意愿减弱，对后市以看跌为主。`
  },
  cryptoMarketCap: {
    type: "cryptoMarketCap",
    showIndex: false,
    endpoint: "/v2/crypto_market_cap",
    filedsName: [],
    filedsClass: [],
    label: "BTC市值占比",
    icon: require("../../assets/images/biz/bang-market.png"),
    iconLarge: require("../../assets/images/rank/cryptoMarketCap.png"),
    bgColor: "#FFA700",
    title: "比特币市值占比",
    subTitle: "占比说明",
    desc: `比特币市值占比，指的是流通比特币的总美元市值，占加密货币总美元市值的比例。\r\r
加密货币总市值变化，反应了资金净流入、流出加密货币市场的方向，表达了大机构与投资者对投资加密货币市场的热情变化。\r\r
比特币（BTC）市值占比的提升，一方面可能意味有更多的投资者在观望到整个市场的行情后，把资产转移成了 BTC 。另一方面也可能代表有更多的新人（新资金）进入到比特币中来。`
  }
}
