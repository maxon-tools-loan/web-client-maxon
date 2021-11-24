import {inject} from "aurelia-framework"
import {EmployeeService} from "../../services/employee"
@inject(EmployeeService)
export class EmpleadoInfo{
    private service:EmployeeService
    constructor(service:EmployeeService){
        this.service=service;
    }
    private data = {}
    private activate(params) {
     
        this.getInfo(params.employee)
    
    }

    async getInfo(id) {
        this.data = await this.service.getEmployeeInfo(id);
    }
    
  
}