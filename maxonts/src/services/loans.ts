import * as moment from "moment";
import { identity } from "rxjs";
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

  async searchReturns(query, raw_loans = undefined) {
    let loans = raw_loans ?? await this.getLoans()
    //console.log(query)
    if (query?.idEmpleado)
      loans = loans.filter((v: any) => v.idEmpleado === parseInt(query.idEmpleado)) as []
    if(query?.area)
      loans = loans.filter((v:any) => v.area === query.area) as []
    if (query?.status) {
      loans = loans.filter((v: any) => v.status === parseInt(query.status)) as []
    }
    if (query?.startDate) {
      loans = loans.filter((v: any) => moment(v.fecha).format('YYYY-MM-DD') >= query.startDate) as []
    }
    if (query?.endDate) {
      loans = loans.filter((v: any) => moment(v.fecha).format('YYYY-MM-DD') <= query.endDate) as []
    }
    return loans
  }

  async getLoans(search: string = ""): Promise<{ loans: [], users: [] }> {
    // console.log(search);

    //the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
    const response = await fetch(API.URL + '/loans/allactive').then(response => {
      return response.json()
    });
    //console.log(response)
    if (response['code'] == "api.success")
      return {
        loans: response['data']['value'],
        users: response['data']['users'],
      };
  }

  async getAllLoans(search: string): Promise<{ loans: [], users: [] }> {
    const fetch = require('node-fetch');
    //the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
    const response = await fetch(API.URL + '/loans/all').then(response => {
      return response.json()
    });
    //console.log(response)
    if (response['code'] == "api.success")
      return {
        loans: response['data']['value'],
        users: response['data']['users'],
      };
  }

  async postLoan(herramientas, consumibles, datos): Promise<{}> {
    const fetch = require('node-fetch');
    let data = {
      "tools": herramientas,
      "consumibles": consumibles,
      "datos": datos
    };
    console.log(JSON.stringify(data))
    const response = await fetch(API.URL + '/loans/postloan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    return response;
  }

  async getConsumiblesAndTools(){
    const response = await fetch(API.URL + '/loans/activeItems').then(response =>{
      return response.json()
    });
    if(response.code == "api.success") return response['data'];
  }

  async getBasicData(): Promise<{}> {
    const response = await fetch(API.URL + '/items/allids').then(response => {
      return response.json()
    });
    if (response['code'] == "api.success") return response['data'];
  }
}
