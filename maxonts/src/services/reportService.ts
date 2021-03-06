import { url } from "inspector";
import { API } from "../../../config";
import { sleep } from "../utils";
const fetch = require('node-fetch');

/// Clase dedicada a las peticiones de prestamos, hace peticiones a los endpoints del backend server para recibir 
/// un formato xsls que luyego el front end descargara para el usuario
export class ReportService {


    async getReport(query?):Promise<{}> {
        let props = {
          empleado:query?.idEmpleado ==''? undefined : query?.idEmpleado,
          inicio:query?.startDate=='' ? undefined : query?.startDate,
          final:query?.endDate =='' ? undefined : query?.endDate,
          idParte:query?.idParte=='' ? undefined : query?.idParte, 
          area: query?.area
        }
        let params ={}
      
        for (const [key,value] of Object.entries(props)){
          if(value==undefined) continue
          params[key]=value;
        }
      
        let url = new URL(API.URL + '/reports/loanReport')
        url.search = new URLSearchParams(params).toString()
      
          //the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
          const response = await fetch(url).then(response => {
            return response.json()
          });
          //console.log(response)
          if (response['code'] == "api.success")
            return response['data']['value'];
        }

        async getReportDowns(query?):Promise<{}> {
          let props = {

            inicio:query?.startDate=='' ? undefined : query?.startDate,
            final:query?.endDate =='' ? undefined : query?.endDate,
          }
          let params ={}
        
          for (const [key,value] of Object.entries(props)){
            if(value==undefined) continue
            params[key]=value;
          }
        
          let url = new URL(API.URL + '/reports/outsReport')
          url.search = new URLSearchParams(params).toString()
        
            //the URL of the website whose contents are to be fetched is passed as the parameter to the fetch function
            const response = await fetch(url).then(response => {
              return response.json()
            });
            //console.log(response)
            if (response['code'] == "api.success")
              return response['data']['value'];
          }

          async getReportInventory(query?):Promise<{}>{
            let props ={
              idParte:query?.idParte == '' ? undefined :query?.idParte,
              familia:query?.Familia,
              pedido:query?.estado,
            }
            let params = {}
            for (const [key,value] of Object.entries(props) ){
                if(value == undefined) continue
                params[key]=value
            }
            let url = new URL(API.URL +'/reports/orders')
            url.search = new URLSearchParams(params).toString()
            const response = await fetch(url).then(response => {
              return response.json()
            });
            console.log(response)
            //console.log(response)
            if (response['code'] == "api.success") return response['data']['value'];

  
          }

  
}
