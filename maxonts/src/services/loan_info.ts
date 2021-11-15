import { sleep } from "utils";



export class LoansInfoService {
  async getLoanInfo(id:string): Promise<{}> {

    const fetch = require('node-fetch');
//the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
    let header = {"ID":id}

    let params = new URLSearchParams(header)
    const response = await fetch('http://localhost:3000/api/loans/loanInfo?'+params).then(response => {
      return response.json()
   });
   console.log(response)
   if (response['code']=="api.success") return response['data'];
  }
}
