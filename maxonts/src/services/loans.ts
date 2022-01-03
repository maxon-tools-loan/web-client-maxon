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

///El servicio de prestmoas, este servicios esta orientado a obtener informacion de los prestamos, hacer altas y bajas de datos
/// Obtener informacion basados en parametros ademas de filtrar la informacion segun sea requerido
export class LoansService {

  async commitDown(tools,consumibles,meta){

    let data={'tools':tools,'meta':meta,'consumibles':consumibles }
    const response = await fetch(API.URL + '/items/downMaterial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)}).then(response => {
      return response.json()
    });
    //console.log(response)
    if(response.data =="api.success") return response
  }

  async getIdLoansByIdParte (data){
    data={'id':data}
    const response = await fetch(API.URL + '/items/filterParte', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)}).then(response => {
      return response.json()
    });
    if(response.code =="api.success") return response['data']['ids']
  }

  async searchReturns(query, raw_loans = undefined) {
    //console.log("AAAAAAAAAAAAA")
    let loans = raw_loans ?? await this.getLoans(undefined,undefined,undefined)
    ////console.log(query)
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
    if (query?.idParte){
      let ids = await this.getIdLoansByIdParte(query.idParte)
      loans = loans = loans.filter((v: any) => ids.includes(v.idPrestamo))
    }
    return loans
  }

  async getLoans(search:  "" | undefined,page=undefined ,query?): Promise<{ loans: [], users: [],maxPages:number,areas:[] }> {
    let props = {
      empleado:query?.idEmpleado ==''? undefined : query?.idEmpleado,
      area:query?.area,
      estado:query?.status,
      inicio:query?.startDate=='' ? undefined : query?.startDate,
      final:query?.endDate =='' ? undefined : query?.endDate,
      page:page,
      numberOfRecords:15
    }
    let params = {}

    for (const [key,value] of Object.entries(props)){
      if(value==undefined) continue;
      params[key] = value
    }
    var url = new URL(API.URL + '/loans/allactive')
    url.search = new URLSearchParams(params).toString()
    const response = await fetch(url).then(response => {
      return response.json()
    });
    ////console.log(response)
    if (response['code'] == "api.success")
      return {
        loans: response['data']['value'],
        users: response['data']['users'],
        maxPages : response['data']['pages'],
        areas: response['data']['areas']
      };
  }

  async getAllLoans(search?: string,page?:number,query?): Promise<{ loans: [], users: [],maxPages:number, areas:[] }> {
  let props = {
    empleado:query?.idEmpleado ==''? undefined : query?.idEmpleado,
    page:page,
    estado:query?.status,
    inicio:query?.startDate=='' ? undefined : query?.startDate,
    final:query?.endDate =='' ? undefined : query?.endDate,
    idParte:query?.idParte=='' ? undefined : query?.idParte,
    area: query?.area == ''?undefined :query?.area,
    numberOfRecords:15
  }
  let params ={}

  for (const [key,value] of Object.entries(props)){
    if(value==undefined) continue
    params[key]=value;
  }

  let url = new URL(API.URL + '/loans/all')
  url.search = new URLSearchParams(params).toString()

    //the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
    const response = await fetch(url).then(response => {
      return response.json()
    });
    
    if (response['code'] == "api.success")
      return {
        loans: response['data']['value'],
        users: response['data']['users'],
        maxPages:response['data']['pages'],
        areas:response['data']['areas']
      };
  }

  async postLoan(herramientas, consumibles, datos): Promise<{}> {
    const fetch = require('node-fetch');
    let data = {
      "tools": herramientas,
      "consumibles": consumibles,
      "datos": datos
    };
    //console.log(JSON.stringify(data))
    const response = await fetch(API.URL + '/loans/postloan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r=> r.json())

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


