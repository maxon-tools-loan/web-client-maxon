import { API } from "../../../config";
import { sleep } from "../utils";
const fetch = require('node-fetch');


export class InventoryService {

  async registerManteinance(tools,consumibles,metadata){
    let props = {
      "tools":tools,
      "consumibles":consumibles,
      "metadata":metadata,
    };
    const response = await fetch(API.URL + '/items/registerMaintenance',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    })
   
    return response;
  }


  async getOrderInfo():Promise<[]>{
    const response = await fetch('http://localhost:3000/api/items/orders').then(response => {
      return response.json()
   });
   console.log(response)
   if (response['code']=="api.success") return response['data']['value'];
  }



  async getInventoryItems(param): Promise<[]> {
    const response = await fetch('http://localhost:3000/api/items/all').then(response => {
      return response.json()
   });
   console.log(response)
   if (response['code']=="api.success") return response['data']['value'];
  }

  async getItemInfo(idParte):Promise<[]>{
    const params =new URLSearchParams({"idParte":idParte})
    const response = await fetch('http://localhost:3000/api/items/itemInfo?' + params).then(response => {
      return response.json()
   });
  
   console.log(response)
   if (response['code']=="api.success") return response['data']['value'];
    return
  }

  async updateStatus(data): Promise<{}>{
    let props = {
      "id":data.idParte,
      "state":data.estado
    };
    const response = await fetch(API.URL + '/items/updateState',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    })
   
    return response;
    
  }
}
