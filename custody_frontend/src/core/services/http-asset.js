import { DI } from 'core'

export default class AssetHttp {
  getFavoritePair() {
    return DI.get('baseMainHttp').get('/asset/favorite')
  }

  updateFavoritePair(data) {
    return DI.get('baseMainHttp').post('/asset/favorite', data)
  }

  deleteFavoritePair(data) {
    return DI.get('baseMainHttp').post('/asset/favorite/cancel', data)
  }

  getRecommendAsset() {
    return DI.get('baseMainHttp').get('recommend_assets')
  }

}
