import {PLATFORM} from "aurelia-pal"
import {RouterConfiguration, Router} from 'aurelia-router';
import {routes} from "./routes"

const obj = routes.map((route) => ({route: `/${route.path}`, name: route.displayname, moduleId: PLATFORM.moduleName(`screens/${route.path}/${route.path}`)}))




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
      { route: '/login', name: 'login', moduleId: PLATFORM.moduleName('login/login'),  title:'Login Page' },
      { route: '/loans', name: "loans", moduleId: PLATFORM.moduleName('screens/loans/loans')},
      { route: '/returns', name: "returns", moduleId: PLATFORM.moduleName('screens/returns/returns')},
      { route: '/inventory', name: "inventory", moduleId: PLATFORM.moduleName('screens/inventory/inventory')}
      //...obj
    ]);
  }
}
