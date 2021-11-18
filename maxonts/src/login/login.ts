import { SWAL_LOGIN_INCOMPLETE_CREDENTIALS, SWAL_LOGIN_INVALID_CREDENTIALS, SWAL_UNKNOWN_ERROR } from './../swals/error';
import Swal from 'sweetalert2';
import {SessionService} from "../services/session"
import {inject} from "aurelia-framework"

@inject(SessionService)
export class Login {
  
  title = "Login Screen"

  username = ''
  password = ''

  sessionService: SessionService

  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  async submit(): Promise<void> {
    const status = await this.sessionService.login(this.username, this.password)
    console.log(status)
    if (status === "api.user.login.incompleteCredentials") {
      Swal.fire(SWAL_LOGIN_INCOMPLETE_CREDENTIALS)
      return
    }
    if (status === "api.user.login.incorrectPassword") {
      Swal.fire(SWAL_LOGIN_INVALID_CREDENTIALS)
      return
    }
    
    if (status !== "api.user.login.success") {
      Swal.fire(SWAL_UNKNOWN_ERROR)
      return
    }

    console.log(this.sessionService.getFullSession())
  }

}
