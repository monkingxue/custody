export const RED_STATUS = [
  {
    value: 1,
    name: '发红包'
  },
  {
    value: 2,
    name: '收红包'
  },
  {
    value: 5,
    name: '红包退回'
  }
]

export const ORDER_STATUS = [
  {
    value: 'open',
    name: '待支付'
  },
  {
    value: 'pay_success',
    name: '处理中'
  },
  {
    value: 'canceled',
    name: '已取消'
  },
  {
    value: 'processing',
    name: '处理中'
  },
  {
    value: 'buy_currency_success',
    name: '已完成'
  },
  {
    value: 'buy_currency_fail',
    name: '交易失败'
  }
]

export const EXCHANGE_ORDER_STATUS = [
  {
    value: 'open',
    name: '待成交'
  },
  {
    value: 'pay_success',
    name: '处理中'
  },
  {
    value: 'canceled',
    name: '已撤销'
  },
  {
    value: 'processing',
    name: '处理中'
  },
  {
    value: 'buy_currency_success',
    name: '完全成交'
  },
  {
    value: 'buy_currency_fail',
    name: '交易失败'
  },
  {
    value: 'pending',
    name: '等待成交'
  },
  {
    value: 'partial_filled',
    name: '部分成交'
  }
]

export const WITHDRAW_ORDER_STATUS = {
  0: "处理中",
  1: "处理中",
  2: "转账中",
  3: "已完成",
  6: "审核不通过",
  7: "转账失败"
}
