import { sleep } from "utils";
import { API } from "../../../config";

const fetch = require('node-fetch');

export class LoansInfoService {
  async getLoanInfo(id:string): Promise<{}> {

    
//the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
    let header = {"ID":id}

    let params = new URLSearchParams(header)
    const response = await fetch('http://localhost:3000/api/loans/loanInfo?'+params).then(response => {
      return response.json()
   });
   console.log(response);
   if (response['code']=="api.success") return response['data'];
  }

  async updateLoanInfo(tools,consumibles,metadata): Promise<{}>{
    
    let data = {
      "tools":tools,
      "consumibles":consumibles,
      "datos":metadata
    };
    console.log(JSON.stringify(data))
    const response = await fetch(API.URL + '/loans/updateloan',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    console.log(response['code']);
    return response['code'];

  }


}
