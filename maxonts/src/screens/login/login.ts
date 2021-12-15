import {SessionService} from "../../services/session"
import {inject} from "aurelia-framework"
import {Router, Redirect} from "aurelia-router"
import { Sidebar } from "sidebar"
import Swal from "sweetalert2"
import { SWAL_INCORRECT_INPUT } from "swals/error"

@inject(SessionService, Router,Sidebar)
export class Login {
  
  private title = "Login Screen"

  private username = ''
  private password = ''

  sessionService: SessionService
  router: Router;
  sidebar:Sidebar

  constructor(sessionService: SessionService, router: Router,sd:Sidebar) {
    this.sessionService = sessionService;
    this.router = router
    this.sidebar = sd
  }

  async submit(): Promise<void> {
    console.log(this.username, this.password)
    
    const bool = await this.sessionService.login(this.username, this.password)
    console.log(bool)
    if(bool==true){
      new Redirect('/inventory').navigate(this.router)
      
    }
    else Swal.fire(SWAL_INCORRECT_INPUT)
    

  }

}
