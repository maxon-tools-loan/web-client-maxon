import {inject} from "aurelia-framework"
import {EmployeeService} from "../../services/employee"
@inject(EmployeeService)
export class EmpleadoInfo{
    private service:EmployeeService
    constructor(service:EmployeeService){
        this.service=service;
    }
    private data = {}

    //Obtener los datos pasados en la URL
    private activate(params) { 
        this.getInfo(params.employee)
    }


    ///Obtener los datos del empleado
    async getInfo(id) {
        this.data = await this.service.getEmployeeInfo(id);
    }
    
  
}