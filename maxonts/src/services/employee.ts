import { sleep } from "../utils";
import { API } from "../../../config";
const fetch = require('node-fetch');


export class EmployeeService {


  async changePass(username,pass){
    let props = {'user':{username:username},'newPassword':pass};
    console.log(props)
    const response = await fetch(API.SESSION+ '/api/admin/change_password',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    }
   ).then(r=>r.json());
    console.log(response)
   if (response['code']=="api.success") return response;

  }

  async registerUser(idEmpleado,user){
    let props = {'user':{'username':user,'idEmpleado':idEmpleado}};
    
    const response = await fetch(API.URL + '/employees/registerUser',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    }
   ).then(r=>r.json());

    console.log(response)
   if (response['data']=='api.success') return response;
  }


  async getactiveEmployees(): Promise<[]> {

    const response = await fetch(API.URL + '/employees/active').then(response => {
      return response.json()
   });
   console.log(response)
   if (response['code']=="api.success") return response;

  }

  async getEmployeeInfo(id): Promise<[]> {
    let params = new URLSearchParams({"idEmpleado":id})
    const response = await fetch(API.URL + '/employees/info?'+params).then(response => {
      return response.json()
   });
   console.log(response)
   if (response['code']=="api.success") return response['data']['value'][0];
  }

  async getItemInfo(idParte):Promise<[]>{
    const params =new URLSearchParams({"idParte":idParte})
    const response = await fetch(API.URL + '/items/itemInfo?' + params).then(response => {
      return response.json()
   });
  
   console.log(response)
   if (response['code']=="api.success") return response['data']['value'];
    return
  }

  async UpdateEmployyes(data:[]){
    const props = {'employees':data}
    const response = await fetch(API.URL + '/employees/updateEmployees',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    }).then(r=> r.json())

    return response
  }
  
}
