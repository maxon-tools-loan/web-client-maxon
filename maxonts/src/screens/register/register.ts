import {SessionService} from "../../services/session"
import {inject} from "aurelia-framework"
import { EmployeeService } from "services/employee"
import Swal from "sweetalert2"
import { SWAL_SUCCESS } from "swals/question"
import { SWAL_ERROR } from "swals/error"

@inject(SessionService,EmployeeService)
export class Register {
  
  private title = "Register Screen"

  private name = ''
  private username = ''
  private email = ''
  private password = ''
  private confirmPassword = ''
  Empleado =null
  empleados = []
  private sessionService: SessionService
  EmployeeService:EmployeeService
  ADMIN=false;
  CONSULTAS=false;
  PRESTAMOS=true;
  REGISTROS=false;
  
  constructor( sessionService: SessionService,EmployeeService :EmployeeService ) {
    this.sessionService =  sessionService;
    this.EmployeeService = EmployeeService;
    this.setup()
  }
  async setup(){
    let data = await this.EmployeeService.getactiveEmployees();
    this.empleados = data['data']['value']
  }

  async submit(): Promise<void> {
    if (this.password !== this.confirmPassword) {
      console.log('passwords don\'t match')
      return;
    }

    const response = await this. sessionService.createUser({
      name: this.name, email: this.email, username: this.username, password: this.password 
    },{"ADMIN":this.ADMIN,"CONSULTAS":this.CONSULTAS,"PRESTAMOS":this.PRESTAMOS,"REGISTROS":this.REGISTROS})
    console.log(this.Empleado)
    if (response['code'] =='api.user.create.success'){
        let x =await this.EmployeeService.registerUser(this.Empleado,response['data']['username'])
        console.log(x)
        if(x['data']=='api.success'){
          Swal.fire(SWAL_SUCCESS)
        }else{
          Swal.fire(SWAL_ERROR)
        }
        this.setup()
    }

  }

}
