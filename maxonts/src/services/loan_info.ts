import { sleep } from "utils";
import { API } from "../../../config";

const fetch = require('node-fetch');


////Esta clase se dedica a  obtener informacion realacionada con los pretamos
//// y guardar la informacion relacionadas con los mismos
export class LoansInfoService {
  async getLoanInfo(id:string): Promise<{}> {

    
//the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
    let header = {"ID":id}

    let params = new URLSearchParams(header)
    const response = await fetch(API.URL+'/loans/loanInfo?'+params).then(response => {
      return response.json()
   });
   //console.log(response);
   if (response['code']=="api.success") return response['data'];
  }

  async updateLoanInfo(tools,consumibles,metadata): Promise<{}>{
    
    let data = {
      "tools":tools,
      "consumibles":consumibles,
      "datos":metadata
    };
    //console.log(JSON.stringify(data))
    const response = await fetch(API.URL + '/loans/updateloan',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    //console.log(response['code']);
    return response;

  }


}
