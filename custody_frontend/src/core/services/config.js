import get from 'lodash/get'
import config from '../../../../configs/config'

export default class Config {

  get(key) {
    return get(config, key)
  }

}
