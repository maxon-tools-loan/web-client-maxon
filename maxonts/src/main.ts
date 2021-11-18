import { Aurelia } from 'aurelia-framework';
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css';

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-bootstrap-datetimepicker'));
  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
  // aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('login/login')));
}
