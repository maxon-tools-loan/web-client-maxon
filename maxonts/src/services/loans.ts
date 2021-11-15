import { sleep } from "utils";


export interface Returns {
  loanNo: number;
  employeeNo: number;
  status: number;
  lentBy: number;
  date: number;
}

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
    const fetch = require('node-fetch');
//the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
    const response = await fetch('http://localhost:3000/api/loans/allactive').then(response => {
      return response.json()
   });
   if (response['code']=="api.success") return response['data']['value'] ;
  }

  async getAllLoans(search: string): Promise<[]> {
    console.log(search);
    const fetch = require('node-fetch');
//the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
    const response = await fetch('http://localhost:3000/api/loans/all').then(response => {
      return response.json()
   });
   console.log(response)
   if (response['code']=="api.success") return response['data']['value'] ;
  }
}
