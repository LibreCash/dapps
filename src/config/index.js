import Vue from 'vue'

export default class Config {
  static install (vue, options) {
    Vue.config.libre = new Config(require(`./${options.build ? options.build : 'config_default'}.js`))
  }

  constructor(config) {
    Object.keys(config).forEach(key => this[key] = config[key])
  }

  addressToLink(address) {
    return `${this.network}/${address}`
  }
}