import {SessionService} from "../../services/session"
import {inject} from "aurelia-framework"

@inject(SessionService)
export class Login {
  
  private title = "Login Screen"

  private username = ''
  private password = ''

  private sessionService: SessionService

  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  async submit(): Promise<void> {
    console.log(this.username, this.password)

    const bool = await this.sessionService.login(this.username, this.password)

    console.log(bool)

  }

}
