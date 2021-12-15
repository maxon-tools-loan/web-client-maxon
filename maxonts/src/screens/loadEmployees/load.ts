import { read } from "fs";
import { BlobToUrlValueConverter } from "screens/up_downs/up_downs";
import {inject} from "aurelia-framework"
import { EmployeeService } from "services/employee";
import Swal from "sweetalert2";
import { SWAL_INS_CONFIRM, SWAL_PWD_CONFIRM, SWAL_SUCCESS } from "swals/question";
import { SWAL_ERROR, SWAL_INCORRECT_INPUT } from "swals/error";
import { SessionService } from "services/session";
import {Router,Redirect} from "aurelia-Router"

@inject(EmployeeService,SessionService,Router)
export class EmployeLoader{
 data:File = null;
 service:EmployeeService
 username:string
 newPass:string
 newPassConfirm:string

 constructor(serv:EmployeeService,session:SessionService,rt:Router){
   if(!session.hasPermission('dashboard.write.users'))
        new Redirect('/inventory').navigate(rt)
   this.service = serv
 }

 async changePassword(){
   let r = await Swal.fire(SWAL_PWD_CONFIRM)
   if (!r.isConfirmed) return
   if(this.newPass ==undefined || this.newPass=='' || this.newPass!==this.newPassConfirm){
     Swal.fire(SWAL_INCORRECT_INPUT)
   }
   else{
     let data =this.service.changePass(this.username,this.newPass)
     if (data['code']=='api.error'){
       Swal.fire(SWAL_SUCCESS)
     }
     else{
       Swal.fire(SWAL_ERROR)
     }
   }
   this.username=''
   this.newPass=''
   this.newPassConfirm=''
 }
 

 async load(){
  
     let rd =  new FileReader()
     let ds
     
     rd.onload= ()=>{
        
            ds = rd.result;
            ds = csvToArray(ds,'|',['idEmpleado','nombre','area','supervisor'])
            //console.log(ds)
            this.commit(ds)
            
        
     }
      rd.readAsText(this.data[0])
     
     
 }

 async commit(ds){

  if (ds ==null){
    await Swal.fire(SWAL_INCORRECT_INPUT)
    return
  } 

  let res =await Swal.fire(SWAL_INS_CONFIRM)
  if(res.isConfirmed){
    let res =await this.service.UpdateEmployyes(ds)
    if(res.data =='api.success'){
      await Swal.fire(SWAL_SUCCESS)
      this.data=null
    }
    else{
      await Swal.fire(SWAL_ERROR)
    }
  }
 }

 
}

export function csvToArray(str, delimiter = ",", headers = undefined) {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    if (headers==undefined){
        headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    }
  
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
        if (header =='supervisor' && values[index]!=undefined){
          object[header] = values[index].slice(0,-1);
        }
        else{
            object[header] = values[index]
        }
          return object;
        }, {});
        return el;
      });
    
      // return the a
      return arr
  }