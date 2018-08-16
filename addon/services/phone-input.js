import Service from '@ember/service'
import loadScript from 'ember-phone-input/utils/load-script'
import { reads } from '@ember-decorators/object/computed'
import { service } from '@ember-decorators/service'

export default class PhoneInputService extends Service {
  @service config

  didLoad = this.didLoad || false

  @reads("config['ember-phone-input'].lazyLoad") lazyLoad

  init() {
    super.init(...arguments)

    if (!this.lazyLoad && this.get('config.environment') !== 'test') {
      // if lazyLoad is disabled, load them now
      // that is to say at the app boot
      this.load()
    }
  }

  load() {
    const doLoadJquery = window.jQuery
      ? Promise.resolve()
      : loadScript('/assets/ember-phone-input/scripts/jquery.min.js')

    const doLoadScript1 = this.didLoad
      ? Promise.resolve()
      : loadScript('/assets/ember-phone-input/scripts/intlTelInput.min.js')

    const doLoadScript2 = this.didLoad
      ? Promise.resolve()
      : loadScript('/assets/ember-phone-input/scripts/utils.js')

    return doLoadJquery
      .then(Promise.all([doLoadScript1, doLoadScript2]))
      .then(() => this.set('didLoad', true))
  }
}
