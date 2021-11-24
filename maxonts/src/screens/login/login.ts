import {SessionService} from "../../services/session"
import {inject} from "aurelia-framework"
import {Router, Redirect} from "aurelia-router"

@inject(SessionService, Router)
export class Login {
  
  private title = "Login Screen"

  private username = ''
  private password = ''

  sessionService: SessionService
  router: Router;

  constructor(sessionService: SessionService, router: Router) {
    this.sessionService = sessionService;
    this.router = router
  }

  async submit(): Promise<void> {
    console.log(this.username, this.password)

    const bool = await this.sessionService.login(this.username, this.password)
    

    new Redirect('/inventory').navigate(this.router)
    console.log(bool)

  }

}
