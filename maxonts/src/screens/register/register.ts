import {SessionService} from "../../services/session"
import {inject} from "aurelia-framework"

@inject(SessionService)
export class Register {
  
  title = "Register Screen"

  name = ''
  username = ''
  email = ''
  password = ''
  confirmPassword = ''

  sessionService: SessionService

  constructor( sessionService: SessionService) {
    this.sessionService =  sessionService;
  }

  async submit(): Promise<void> {
    if (this.password !== this.confirmPassword) {
      console.log('passwords don\'t match')
      return;
    }

    const response = await this. sessionService.createUser({
      name: this.name, email: this.email, username: this.username, password: this.password 
    })

    console.log(response);
  }

}
