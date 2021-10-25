import {LoginService} from "../services/login"
import {inject} from "aurelia-framework"

@inject(LoginService)
export class Login {
  
  title = "Login Screen"

  username = ''
  password = ''

  loginService: LoginService

  constructor(loginService: LoginService) {
    this.loginService = loginService;
  }

  async submit(): Promise<void> {
    console.log(this.username, this.password)

    const bool = await this.loginService.login(this.username, this.password)

    console.log(bool)

  }

}
