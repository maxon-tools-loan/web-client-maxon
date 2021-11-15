import { sleep } from "../utils";
const fetch = require('node-fetch');


export class EmployeeService {
  async getEmployeeInfo(id): Promise<[]> {
    let params = new URLSearchParams({"idEmpleado":id})
    const response = await fetch('http://localhost:3000/api/employees/info?'+params).then(response => {
      return response.json()
   });
   console.log(response)
   if (response['code']=="api.success") return response['data']['value'][0];
  }

  async getItemInfo(idParte):Promise<[]>{
    const params =new URLSearchParams({"idParte":idParte})
    const response = await fetch('http://localhost:3000/api/items/itemInfo?' + params).then(response => {
      return response.json()
   });
  
   console.log(response)
   if (response['code']=="api.success") return response['data']['value'];
    return
  }
}
