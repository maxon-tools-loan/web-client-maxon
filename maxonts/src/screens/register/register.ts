import {SessionService} from "../../services/session"
import {inject} from "aurelia-framework"

@inject(SessionService)
export class Register {
  
  private title = "Register Screen"

  private name = ''
  private username = ''
  private email = ''
  private password = ''
  private confirmPassword = ''

  private sessionService: SessionService

  constructor( sessionService: SessionService) {
    this.sessionService =  sessionService;
  }

  async submit(): Promise<void> {
    console.log(this.username, this.password)

    const bool = await this. sessionService.createUser({
      name: this.name, email: this.email, username: this.username, password: this.password 
    })

    console.log(bool)

  }

}
