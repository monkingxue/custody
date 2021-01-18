import DI from '@kpi/di'
// import Config from './config'
// import Contract from './http-contract'
import OfflineStorage from './localstorage'
import BaseMainHttp from './base-main-http'
import Auth from './auth'
import AuthHttp from './http-auth'
import MarketHttp from './http-market'
import OrderHttp from './http-order'
import AccountHttp from './http-account'
import ReceiptHttp from './http-receipt'
import AssetHttp from './http-asset'
import PairHttp from './http-pair'
import RankingHttp from './http-ranking'
import YubibaoHttp from './http-yubibao'
import NotificationHttp from './http-notification'
import StockHttp from './http-stock'
import MiningHttp from './http-mining'
import PortfolioHttp from './http-portfolio'
import Utils from './utils'
import Bridge from './bridge'
import Niuyan from './niuyan'

DI.bind('authHttp', AuthHttp)
DI.bind('marketHttp', MarketHttp)
DI.bind('orderHttp', OrderHttp)
DI.bind('assetHttp', AssetHttp)
DI.bind('yubibaoHttp', YubibaoHttp)
DI.bind('notificationHttp', NotificationHttp)
DI.bind('accountHttp', AccountHttp)
DI.bind('receiptHttp', ReceiptHttp)
DI.bind('pairHttp', PairHttp)
DI.bind('portfolioHttp', PortfolioHttp)
DI.bind('rankingHttp', RankingHttp)
DI.bind('stockHttp', StockHttp)
DI.bind('miningHttp', MiningHttp)
// DI.bind('config', Config)
// DI.bind('contract', Contract)
DI.bind('baseMainHttp', BaseMainHttp)
DI.bind('offlineStorage', OfflineStorage)
DI.bind('utils', Utils)
DI.bind('auth', Auth, false)
DI.bind('bridge', Bridge)
DI.bind('niuyan', Niuyan)
