import {SessionService} from "../../services/session"
import {inject} from "aurelia-framework"
import { EmployeeService } from "services/employee"
import Swal from "sweetalert2"
import { SWAL_SUCCESS } from "swals/question"
import { SWAL_ERROR, SWAL_INCORRECT_INPUT } from "swals/error"
import {Router,Redirect} from 'aurelia-router'

@inject(SessionService,EmployeeService,Router)
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
  router;

  ///Constructor de la clase y verificacion de permisos
  constructor( sessionService: SessionService,EmployeeService :EmployeeService ,rt:Router) {
    if(!sessionService.hasPermission('dashboard.write.users')) 
        new Redirect('auth/login').navigate(rt)
    this.sessionService =  sessionService;
    this.EmployeeService = EmployeeService;
    this.router = rt
    this.setup()
  }
  //Obtener los datos escenciales para el funcionamiento de la app (id de empleados)
  async setup(){
    let data = await this.EmployeeService.getactiveEmployees();
    this.empleados = data['data']['value']
  }

  /// Hacer commit de los cambios y registrar empleado
  async submit(): Promise<void> {
    if (this.password !== this.confirmPassword) {
      //console.log('passwords don\'t match')
      return;
    }
    if(this.Empleado==null){
      Swal.fire(SWAL_INCORRECT_INPUT)
      return
    }

    const response = await this. sessionService.createUser({
      name: this.name, email: this.email, username: this.username, password: this.password 
    },{"ADMIN":this.ADMIN,"CONSULTAS":this.CONSULTAS,"PRESTAMOS":this.PRESTAMOS,"REGISTROS":this.REGISTROS})
    //console.log(this.Empleado)
    if (response['code'] =='api.user.create.success'){
        let x =await this.EmployeeService.registerUser(this.Empleado,response['data']['username'])
        //console.log(x)
        if(x['data']=='api.success'){
          Swal.fire(SWAL_SUCCESS)
        }else{
          Swal.fire(SWAL_ERROR)
        }
        this.setup()
    }
    new Redirect('auth/login').navigate(this.router)

  }

}
