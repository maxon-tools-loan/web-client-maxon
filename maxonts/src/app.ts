import { SessionService } from 'services/session';
import { inject } from 'aurelia-framework';
import { autoinject } from 'aurelia-dependency-injection'
import {PLATFORM} from "aurelia-pal"
import {RouterConfiguration, Router} from 'aurelia-router';
import "reflect-metadata"


@autoinject()
@inject(SessionService)
export class App {
  public message = 'Maxon Tools Loan';
  router: Router;
  sessionService: SessionService;

  constructor(session: SessionService) {
    this.sessionService = session
  }

  async configureRouter(config: RouterConfiguration, router: Router) {
    
    this.router = router;
    config.title = 'Maxon Loan System';
    config.options.root = '/';
    config.options.pushState = true;
    config.map([
      { route: '/login', name: 'login', moduleId: PLATFORM.moduleName('login/login'),  title:'Login Page' },
      { route: '/register', name: 'register', moduleId: PLATFORM.moduleName('screens/register/register'),  title:'Register Page' },
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
      { route: '/items/:partNo', name: "partInfo", moduleId: PLATFORM.moduleName('screens/item/item_info')},
      { route: '', redirect: '/loans' },
    ]);

    if (!(await this.sessionService.isLoggedIn())) {
      setTimeout(() => {
        console.log("User not logged in, redirecting to /login", this.sessionService.getFullSession())
        router.navigate('login')
      })
    }
  }
}
