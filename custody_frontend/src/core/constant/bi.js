// done
export const BI_TYPE = [
  "BTC",
  "USDT",
  "ETH",
  "EOS",
  "TRX",
  "BCH",
  "BNB",
  "XRP",
  "HT",
  "LTC"
]

// 法币交易的币种和顺序 done
export const BI_IMG = [
  require('../../assets/images/bi/bi_btc.png'),
  require('../../assets/images/bi/bi_usdt.png'),
  require('../../assets/images/bi/bi_eth.png'),
  require('../../assets/images/bi/bi_eos.png'),
  require('../../assets/images/bi/bi_trx.png'),
  require('../../assets/images/bi/bi_bch.png'),
  require('../../assets/images/bi/bi_bnb.png'),
  require('../../assets/images/bi/bi_xrp.png'),
  require('../../assets/images/bi/bi_ht.png'),
  require('../../assets/images/bi/bi_ltc.png'),
  require('../../assets/images/bi/bi_okb.png')
]

// 币 中文名 done
export const BI_NAME = {
  BTC: '比特币',
  USDT: '泰达币',
  ETH: '以太坊',
  LTC: '莱特币',
  EOS: '柚子',
  BNB: '币安',
  XRP: '瑞波币',
  HT: '火币',
  BCH: '比特现金',
  TRX: '波场',
  OKB: 'OK币'
}

// 购买页面 初始默认购买数量 done
export const BT_INIT_BUY_NUM = {
  BTC: 0.1,
  USDT: 15,
  ETH: 1,
  LTC: 1,
  EOS: 1,
  BNB: 2,
  OKB: 2,
  XRP: 5,
  HT: 1,
  BCH: 0.02,
  TRX: 100
}

// 购买页面 最低购买数量 done
export const BI_MIN_BUY_AMOUNT = {
  BTC: 0.0003,
  USDT: 5,
  ETH: 0.02,
  LTC: 0.1,
  EOS: 0.5,
  BNB: 2,
  OKB: 2,
  XRP: 5,
  HT: 1,
  BCH: 0.02,
  TRX: 100
}

// 购买页面 最高购买数量 done
export const BI_MAX_BUY_AMOUNT = {
  BNB: 30,
  XRP: 6000,
  HT: 1000,
  TRX: 200000
}

// 提币页面 手续费 done
export const BI_WITHDRAW_ACTION_FEE = {
  BTC: 0.0005,
  USDT: 5,
  ETH: 0.01,
  LTC: 0.001,
  EOS: 0.1,
  BNB: 0.001,
  XRP: 0.25,
  HT: 1,
  OKB: 1,
  BCH: 0.001,
  TRX: 1
}

// 提币页面 最低提币数 done
export const BI_WITHDRAW_MIN_AMOUNT = {
  BTC: 0.002,
  USDT: 10,
  ETH: 0.02,
  LTC: 0.002,
  EOS: 0.2,
  XRP: 1,
  HT: 1,
  OKB: 1,
  TRX: 100,
  BNB: 2,
  BCH: 0.1
}

// 禁止法币买买 done
export const BI_DISABLE_BUY = [
  'BNB',
  'OKB'
]

// 禁止提币 done
export const BI_DISABLE_WITHDRAW = [
  'BNB',
  'OKB'
]

// 禁止充值 done
export const BI_DISABLE_DEPOSIT = [
  'BNB',
  'OKB'
]

// 交易精度 几位小数 done
export const BI_TOFIX_NUMBER = {
  USDT: 2,
  BTC: 0,
  ETH: 0,
  EOS: 0,
  LTC: 0,
  BNB: 0,
  XRP: 2,
  HT: 0,
  OKB: 0,
  BCH: 0,
  TRX: 2
}
// export const BI_TOFIX_NUMBER = {
//   USDT:2,
//   BTC: 4,
//   ETH:4,
//   EOS:4,
//   LTC:4,
//   BNB:4,
//   XRP:2,
//   HT:4,
//   BCH:4,
//   TRX:0
// }

// done
export const BI_INFO = {
  "BTC": {
    icon: require('../../assets/images/bi/bi_btc.png'),
    color: "#F7931A"
  },
  "USDT": {
    icon: require('../../assets/images/bi/bi_usdt.png'),
    color: "#2BAB86"
  },
  "ETH": {
    icon: require('../../assets/images/bi/bi_eth.png'),
    color: "#627EEA"
  },
  "EOS": {
    icon: require('../../assets/images/bi/bi_eos.png'),
    color: "#453E57"
  },
  "BCH": {
    icon: require('../../assets/images/bi/bi_bch.png'),
    color: "#F7931A"
  },
  "BNB": {
    icon: require('../../assets/images/bi/bi_bnb.png'),
    color: "#F5C33A"
  },
  "XRP": {
    icon: require('../../assets/images/bi/bi_xrp.png'),
    color: "#000000"
  },
  "HT": {
    icon: require('../../assets/images/bi/bi_ht.png'),
    color: "#2A3069"
  },
  "LTC": {
    icon: require('../../assets/images/bi/bi_ltc.png'),
    color: "#000000"
  },
  "TRX": {
    icon: require('../../assets/images/bi/bi_trx.png'),
    color: "#FF001F"
  },
  "OKB": {
    icon: require('../../assets/images/bi/bi_okb.png'),
    color: "#005DF5"
  }
}

// done
export const BI_NY_COINID = {
  BTC: "bitcoin",
  USDT: "tether",
  ETH: "ethereum",
  EOS: "eos",
  BCH: "bitcoin-cash",
  BNB: "binance-coin",
  XRP: "ripple",
  HT: "huobi-token",
  LTC: "litecoin",
  TRX: "tron",
  OKB: "okex-coin"
}

// new
export const BI_LOCAL_ICON = {
  "BTC": require('../../assets/images/bi/bi_btc.png'),
  "USDT": require('../../assets/images/bi/bi_usdt.png'),
  "ETH": require('../../assets/images/bi/bi_eth.png'),
  "EOS": require('../../assets/images/bi/bi_eos.png'),
  "BCH": require('../../assets/images/bi/bi_bch.png'),
  "BNB": require('../../assets/images/bi/bi_bnb.png'),
  "XRP": require('../../assets/images/bi/bi_xrp.png'),
  "HT": require('../../assets/images/bi/bi_ht.png'),
  "LTC": require('../../assets/images/bi/bi_ltc.png'),
  "TRX": require('../../assets/images/bi/bi_trx.png'),
  "OKB": require('../../assets/images/bi/bi_okb.png')
}

export const OTC_INFO = {
  'coincola': {
    icon: require('../../assets/images/exchange/exchange_CoinCola.png'),
    nameCN: 'CoinCola',
    name: 'CoinCola'
  },
  'okex': {
    icon: require('../../assets/images/exchange/exchange_okex.png'),
    nameCN: 'OKEx',
    nyid: 'okex',
    name: 'OKEx',
    color: '#135AF5'
  },
  'huobi': {
    icon: require('../../assets/images/exchange/exchange_huobi.png'),
    nameCN: '火币',
    name: 'Huobi',
    nyid: 'huobipro',
    color: '#00B6F7'
  },
  'abtc': {
    icon: require('../../assets/images/exchange/exchange_abtc.png'),
    nameCN: 'aBTC',
    name: 'aBTC'
  },
  'biki': {
    icon: require('../../assets/images/exchange/exchange_biki.png'),
    nameCN: 'BiKi',
    name: 'BiKi',
    nyid: 'biki',
    color: '#008BDC'
  },
  'mxc': {
    icon: require('../../assets/images/exchange/exchange_MXC.png'),
    nameCN: '抹茶',
    name: 'MXC',
    nyid: 'mxc',
    color: '#00D182'
  },
  'binance': {
    icon: require('../../assets/images/exchange/exchange_Binance.png'),
    nameCN: '币安',
    nyid: 'binance',
    name: 'Binance',
    color: '#FFC434'
  },
  'gateio': {
    icon: require('../../assets/images/exchange/exchange_gate.png'),
    nameCN: 'Gate.io',
    nyid: 'gateio',
    name: 'Gate.io',
    color: '#FF575F'
  },
  'otcbtc': {
    icon: require('../../assets/images/exchange/exchange_OTC.png'),
    nameCN: 'OTCBTC',
    name: 'OTCBTC'
  },
  'zb': {
    icon: require('../../assets/images/exchange/exchange_ZB.png'),
    nameCN: 'ZB',
    name: 'ZB'
  },
  'bitfinex': {
    icon: require('../../assets/images/exchange/exchange_bitfinex.png'),
    nameCN: 'Bitfinex',
    name: 'Bitfinex',
    nyid: 'bitfinex',
    color: '#99C557'
  },
  'kucoin': {
    icon: require('../../assets/images/exchange/exchange_kucoin.png'),
    nameCN: '库币网',
    name: 'KuCoin',
    nyid: 'kucoin',
    color: '#0192DC'
  },
  'bigone': {
    icon: require('../../assets/images/exchange/exchange_bigone.png'),
    nameCN: 'BigONE',
    name: 'BigONE',
    nyid: 'bigone',
    color: '#9457B2'
  },
  'kraken': {
    icon: require('../../assets/images/exchange/exchange_kraken.png'),
    nameCN: 'K网',
    name: 'Kraken',
    nyid: 'kraken'
  },
  'coinbase': {
    icon: require('../../assets/images/exchange/exchange_coinbasepro.png'),
    nameCN: 'Coinbase Pro',
    name: 'Coinbase Pro',
    nyid: 'gdax'
  },
  'bitstamp': {
    icon: require('../../assets/images/exchange/exchange_bitstamp.png'),
    nameCN: 'Bitstamp',
    name: 'Bitstamp',
    nyid: 'bitstamp'
  },
  'bittrex': {
    icon: require('../../assets/images/exchange/exchange_bittrex.png'),
    name: 'Bittrex',
    nyid: 'bittrex',
    nameCN: 'B网'
  },
  'gemini': {
    icon: require('../../assets/images/exchange/exchange_gemini.png'),
    name: 'Gemini',
    nyid: 'gemini',
    nameCN: '双子星'
  },
  'poloniex': {
    icon: require('../../assets/images/exchange/exchange_poloniex.png'),
    name: 'Poloniex',
    nyid: 'poloniex',
    nameCN: 'P网'
  },
  'hitbtc': {
    icon: require('../../assets/images/exchange/exchange_hitbtc.png'),
    nameCN: 'Hitbtc',
    name: 'Hitbtc',
    nyid: 'hitbtc'
  },
  'rightbtc': {
    icon: require('../../assets/images/exchange/exchange_rightbtc.png'),
    nameCN: 'R网',
    name: 'RightBTC',
    nyid: 'rightbtc'
  },
  'jubi': {
    icon: require('../../assets/images/exchange/exchange_JBEX.png'),
    nameCN: '聚币',
    name: 'Jubi'
  },
  'coinegg': {
    icon: require('../../assets/images/exchange/exchange_coinegg.png'),
    nameCN: '币蛋',
    name: 'Coinegg'
  }
}

export const PAIR_MARKET_PRICE_NY_SUPPORT_OTC = [
  'huobi', 'binance', 'okex', 'bitfinex', 'mxc', 'biki', 'kucoin', 'gateio', 'bigone', 'kraken', 'coinbase', 'bitstamp', 'bittrex', 'gemini', 'poloniex', 'hitbtc'
]

export const AGGREGATE_TRANS_SUPPORT_OTC = [
  'huobi', 'binance', 'gateio', 'mxc', 'bitfinex', 'okex', 'biki', 'bigone', 'kucoin'
]
