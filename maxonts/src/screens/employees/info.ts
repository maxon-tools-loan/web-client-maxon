import {inject} from "aurelia-framework"
import {EmployeeService} from "../../services/employee"
@inject(EmployeeService)
export class EmpleadoInfo{
    service:EmployeeService
    constructor(service:EmployeeService){
        this.service=service;
    }
    data = {}
    activate(params) {
     
        this.getInfo(params.employee)
    
    }

    async getInfo(id) {
        this.data = await this.service.getEmployeeInfo(id);
    }
    
  
}