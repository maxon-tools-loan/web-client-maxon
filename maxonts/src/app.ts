import {PLATFORM} from "aurelia-pal"
import {RouterConfiguration, Router} from 'aurelia-router';
import {routes} from "./routes"
import "reflect-metadata"

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
      { route: '',name:'test', moduleId: PLATFORM.moduleName("login/login"), title: 'Main' },
      { route: 'auth/login', name: 'login', moduleId: PLATFORM.moduleName('login/login'),  title:'Login Page' },
      { route: 'auth/register', name: 'register', moduleId: PLATFORM.moduleName('screens/register/register'),  title:'Register Page' },
      { route: '/loans', name: "loans", moduleId: PLATFORM.moduleName('screens/loans/loans')},
      { route: '/returns', name: "returns", moduleId: PLATFORM.moduleName('screens/returns/returns')},
      { route: '/inventory', name: "inventory", moduleId: PLATFORM.moduleName('screens/inventory/inventory')},
      { route: '/history', name: "history", moduleId: PLATFORM.moduleName('screens/loan_history/history')},
      { route: '/orders', name: "orders", moduleId: PLATFORM.moduleName('screens/orders/orders')},
      { route: '/maintenance', name: "maintenance", moduleId: PLATFORM.moduleName('screens/maintenance/maintenance')},
      { route: '/up_downs', name: "up_downs", moduleId: PLATFORM.moduleName('screens/up_downs/up_downs')},
      { route: '/loaninfo/:id/:readOnly', name: "loanInfo", moduleId: PLATFORM.moduleName('screens/loans_info/loans_info')},
      { route: '/inout', name: "inOut", moduleId: PLATFORM.moduleName('screens/In-Out/inOut')},
      { route: '/userinfo/:employee', name: "employeeInfo", moduleId: PLATFORM.moduleName('screens/employees/info')},
      { route: '/items/:partNo', name: "partInfo", moduleId: PLATFORM.moduleName('screens/item/item_info')}
      //...obj
    ]);
  }
}
