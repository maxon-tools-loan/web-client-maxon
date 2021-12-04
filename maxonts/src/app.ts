import { autoinject } from 'aurelia-dependency-injection'
import { inject } from 'aurelia-framework'
import {PLATFORM} from "aurelia-pal"
import {RouterConfiguration, Router, Next, Redirect, NavigationInstruction} from 'aurelia-router';
import "reflect-metadata"
import { SessionService } from './services/session'

@autoinject()
export class App {
  public message = 'Maxon Tools Loan';
  router: Router;
  authNeeded = false;
  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Maxon Loan System';
    config.addAuthorizeStep(AuthorizeStep);
    config.options.root = '/';
    config.options.pushState = true;
    
    config.map([
      { route: '/auth/login', name: 'login', moduleId: PLATFORM.moduleName('screens/login/login'),  title:'Login Page' },
      { route: '/auth/register', name: 'register', moduleId: PLATFORM.moduleName('screens/register/register'),  title:'Register Page' },
      { route: '/loans', name: "loans", moduleId: PLATFORM.moduleName('screens/loans/loans'), settings: {auth: this.authNeeded}},
      { route: '/returns', name: "returns", moduleId: PLATFORM.moduleName('screens/returns/returns'), settings: {auth: this.authNeeded}},
      { route: '/inventory', name: "inventory", moduleId: PLATFORM.moduleName('screens/inventory/inventory'), settings: {auth: this.authNeeded}},
      { route: '/history', name: "history", moduleId: PLATFORM.moduleName('screens/loan_history/history'), settings: {auth: this.authNeeded}},
      { route: '/orders', name: "orders", moduleId: PLATFORM.moduleName('screens/orders/orders'), settings: {auth: this.authNeeded}},
      { route: '/maintenance', name: "maintenanceR", moduleId: PLATFORM.moduleName('screens/maintenance/maintenance'), settings: {auth: this.authNeeded}},
      { route: '/up_downs', name: "up_downs", moduleId: PLATFORM.moduleName('screens/up_downs/up_downs'), settings: {auth: this.authNeeded}},
      { route: '/loaninfo/:id/:readOnly', name: "loanInfo", moduleId: PLATFORM.moduleName('screens/loans_info/loans_info'), settings: {auth: this.authNeeded}},
      { route: '/inout', name: "inOut", moduleId: PLATFORM.moduleName('screens/outs_register/outs'), settings: {auth: this.authNeeded}},
      { route: '/userinfo/:employee', name: "employeeInfo", moduleId: PLATFORM.moduleName('screens/employees/info'), settings: {auth: this.authNeeded}},
      { route: '/items/:partNo', name: "partInfo", moduleId: PLATFORM.moduleName('screens/item/item_info'), settings: {auth: this.authNeeded}},
      { route: '', redirect: '/auth/login' , settings: {auth: this.authNeeded}},
      { route: '/registerInOuts', name: "reginOut", moduleId: PLATFORM.moduleName('screens/In-Out/inOut'), settings: {auth: this.authNeeded}},
      { route: '/recordsMaintenance', name: "maintenance", moduleId: PLATFORM.moduleName('screens/maintenance_register/maintenance_register'), settings: {auth: this.authNeeded}},
      { route: '/newIn', name: "InsNotRegistered", moduleId: PLATFORM.moduleName('screens/newIn/newIn'), settings: {auth: this.authNeeded}}
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
