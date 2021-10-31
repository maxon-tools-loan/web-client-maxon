import {PLATFORM} from "aurelia-pal"
import {RouterConfiguration, Router} from 'aurelia-router';

export class App {
  public message = 'Maxon Tools Loan';
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Maxon Loan System';
    config.options.root = '/';
    config.options.pushState = true;
    config.map([
      { route: '', moduleId: PLATFORM.moduleName("app"), title: 'Main' },
      { route: '/login', name: 'login', moduleId: PLATFORM.moduleName('login/login'),  title:'Login Page' }
    ]);
  }
}
