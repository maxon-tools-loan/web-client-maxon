import { autoinject } from 'aurelia-dependency-injection'
import { inject } from 'aurelia-framework'
import {PLATFORM} from "aurelia-pal"
import {RouterConfiguration, Router, Next, Redirect, NavigationInstruction} from 'aurelia-router';
import "reflect-metadata"
import { SessionService } from './services/session'

@autoinject()
export class App {
  public message = 'Maxon Tools Loan';
  private router: Router;

  private configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Maxon Loan System';
    config.addAuthorizeStep(AuthorizeStep);
    config.options.root = '/';
    config.options.pushState = true;
    config.map([
      { route: '/auth/login', name: 'login', moduleId: PLATFORM.moduleName('screens/login/login'),  title:'Login Page' },
      { route: '/auth/register', name: 'register', moduleId: PLATFORM.moduleName('screens/register/register'),  title:'Register Page' },
      { route: '/loans', name: "loans", moduleId: PLATFORM.moduleName('screens/loans/loans'), settings: {auth: true}},
      { route: '/returns', name: "returns", moduleId: PLATFORM.moduleName('screens/returns/returns'), settings: {auth: true}},
      { route: '/inventory', name: "inventory", moduleId: PLATFORM.moduleName('screens/inventory/inventory'), settings: {auth: true}},
      { route: '/history', name: "history", moduleId: PLATFORM.moduleName('screens/loan_history/history'), settings: {auth: true}},
      { route: '/orders', name: "orders", moduleId: PLATFORM.moduleName('screens/orders/orders'), settings: {auth: true}},
      { route: '/maintenance', name: "maintenance", moduleId: PLATFORM.moduleName('screens/maintenance/maintenance'), settings: {auth: true}},
      { route: '/up_downs', name: "up_downs", moduleId: PLATFORM.moduleName('screens/up_downs/up_downs'), settings: {auth: true}},
      { route: '/loaninfo/:id/:readOnly', name: "loanInfo", moduleId: PLATFORM.moduleName('screens/loans_info/loans_info'), settings: {auth: true}},
      { route: '/inout', name: "inOut", moduleId: PLATFORM.moduleName('screens/In-Out/inOut'), settings: {auth: true}},
      { route: '/userinfo/:employee', name: "employeeInfo", moduleId: PLATFORM.moduleName('screens/employees/info'), settings: {auth: true}},
      { route: '/items/:partNo', name: "partInfo", moduleId: PLATFORM.moduleName('screens/item/item_info'), settings: {auth: true}},
      { route: '', redirect: '/auth/login' , settings: {auth: true}},
    ]);
  }
}

@inject(SessionService)
class AuthorizeStep {

    sessionService: SessionService;
    constructor(sessionService: SessionService) {
      this.sessionService = sessionService;
    }

    run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
      if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
        var isLoggedIn = this.sessionService.userData ? true: false;
        if (!isLoggedIn) {
          return next.cancel(new Redirect('/auth/login'));
        }
      }
  
      return next();
    }
}
