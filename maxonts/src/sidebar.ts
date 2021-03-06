import {inject} from 'aurelia-framework';
import { SessionService } from 'services/session';
import {Redirect, Router} from 'aurelia-router';

@inject(SessionService, Router)
export class Sidebar {

  public sessionService: SessionService
  public router: Router
  public hasPermission: any
  dashboard: any;
  public user:string =''

  constructor(sessionService: SessionService, router: Router) {
    this.sessionService = sessionService;
    this.hasPermission = this.sessionService.hasPermission;
    if (this.sessionService.getFullSession()!=null){
    this.user = this.sessionService.getFullSession().user?.username ?? ''}
    this.router = router;
    this.sessionService.watch(() => this.updatePermissions())
    this.sessionService.refreshSession()
    this.updatePermissions()
  }

  public refresh(){
    this.user = this.sessionService.getFullSession().user?.username ?? ''
  }

  updatePermissions() {
    this.dashboard = {
      read: {
        sidebar: this.hasPermission("dashboard.read"),
        loans:this.hasPermission("dashboard.read.loans"),
        returns: this.hasPermission("dashboard.read.returns"),
        inventory: this.hasPermission("dashboard.read.inventory"),
        loan_history: this.hasPermission("dashboard.read.loan_history"),
        orders: this.hasPermission("dashboard.read.orders"),
        maintenance: this.hasPermission("dashboard.read.maintenance"),
        up_down: this.hasPermission("dashboard.read.up_down"),
        in_out: this.hasPermission("dashboard.read.in_out"),
        users: this.hasPermission("dashboard.write.users"),
      }
    }
  }

  async logout () {
    //console.log('logout...')
    const bool = await this.sessionService.logout();
    new Redirect('/auth/login').navigate(this.router)
    this.user = ''
    return bool;
    
  }
}
