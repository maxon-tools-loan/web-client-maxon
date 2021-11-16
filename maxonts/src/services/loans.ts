import { sleep } from "utils";
import { API } from '../../../config'

export interface Returns {
  loanNo: number;
  employeeNo: number;
  status: number;
  lentBy: number;
  date: number;
}
const fetch = require('node-fetch');
const returns: Returns[] = [
  {
    loanNo: 1231,
    employeeNo: 123912,
    status: 1290312,
    lentBy: 1902397,
    date: 2193012312,
  },
  {
    loanNo: 1231,
    employeeNo: 123912,
    status: 1290312,
    lentBy: 1902397,
    date: 2193012312,
  },
  {
    loanNo: 1231,
    employeeNo: 123912,
    status: 1290312,
    lentBy: 1902397,
    date: 2193012312,
  }
];

export class LoansService {
  
  async getLoans(search: string): Promise<[]> {
    console.log(search);
    
//the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
    const response = await fetch(API.URL + '/loans/allactive').then(response => {
      return response.json()
   });
   if (response['code']=="api.success") return response['data']['value'] ;
  }

  async getAllLoans(search: string): Promise<[]> {
    console.log(search);
    const fetch = require('node-fetch');
//the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
    const response = await fetch(API.URL + '/loans/all').then(response => {
      return response.json()
   });
   console.log(response)
   if (response['code']=="api.success") return response['data']['value'] ;
  }

  async postLoan(herramientas,consumibles,datos):Promise<{}>{
    const fetch = require('node-fetch');
    let data = {
      "tools":herramientas,
      "consumibles":consumibles,
      "datos":datos
    };
    console.log(JSON.stringify(data))
    const response = await fetch(API.URL + '/loans/postloan',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
   
    return response;
  }

  async getBasicData():Promise<{}>{
    const response = await fetch(API.URL + '/items/allids').then(response => {
      return response.json()
   });
    if (response['code']=="api.success") return response['data'] ;
  }
}
