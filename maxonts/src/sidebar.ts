import {inject} from 'aurelia-framework';
import { SessionService } from 'services/session';
import {Redirect, Router} from 'aurelia-router';

@inject(SessionService, Router)
export class Sidebar {

  public sessionService: SessionService
  public router: Router

  constructor(sessionService: SessionService, router: Router) {
    this.sessionService = sessionService;
    this.router = router;
  }

  async logout () {
    console.log('logout...')
    const bool = await this.sessionService.logout();
    new Redirect('/auth/login').navigate(this.router)
    return bool;
  }

// NO LE MUEVAS 8)
// YA ME ROBE ESTE CODIGUITO
}
