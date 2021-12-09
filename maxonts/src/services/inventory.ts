import { API } from "../../../config";
import { sleep } from "../utils";
const fetch = require('node-fetch');


export class InventoryService {

  async getItemsNotRegistered(){
    const response = await fetch(API.URL + '/items/newIDs').then( response => {return response.json()})
    if (response['code'] == "api.success") return response['data'];
  }

  async updateMaintenance(item){
    let props ={
      'params':[item]
    }
    const response = await fetch (API.URL + '/items/updateMaintenance',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    }).then(r=>r.json())

    return response
  }

  async getMaintenanceItems(){
    const response = await fetch(API.URL + '/items/recordMaintenance').then( response => {return response.json()})
    if (response['code'] == "api.success") return response['data'];
  }

  async getInItems(){
    const response = await fetch(API.URL + '/items/recordIns').then( response => {return response.json()})
    console.log(response)
    if (response['code'] == "api.success") return response['data'];
  }

  async entryItem(tools,consumibles,meta){
    let props ={
      "tools":tools,
      "consumibles":consumibles,
      "metadata":meta
    }
    const response = await fetch (API.URL + '/items/registerUp',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    }).then(r=> r.json())

    return response

  }

  async getOutItems(){
    const response = await fetch(API.URL + '/items/recordOuts').then( res => {return res.json()})
    console.log(response)
    if (response['code'] == "api.success") return response['data'];
  
  }

  async downItems(tools,consumibles,meta){

    let props ={
      "tools":tools,
      "consumibles":consumibles,
      "metadata":meta
    }
    const response = await fetch (API.URL + '/items/registerDown',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    })

    return response

  }
  async registerItems(items) {
    let props = {
      "items": items
    };
    const response = await fetch(API.URL + '/items/registerItem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    }).then(res=> res.json())

    return response;
  }


  async registerManteinance(tools, consumibles, metadata) {
    let props = {
      "tools": tools,
      "consumibles": consumibles,
      "metadata": metadata,
    };
    const response = await fetch(API.URL + '/items/registerMaintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    }).then(r => r.json())

    return response;
  }


  async getOrderInfo(): Promise<[]> {
    const response = await fetch(API.URL +'/items/orders').then(response => {
      return response.json()
    });
    console.log(response)
    if (response['code'] == "api.success") return response['data']['value'];
  }


  async searchInventoryItems(query, rawItems = undefined) {
    console.log(query)
    let items = rawItems ?? await this.getInventoryItems()
    if (query?.idParte)
      items = items.filter(item => item.idParte.includes(query.idParte))
    if (query?.Familia)
      items = items.filter(item => item.Familia.toLowerCase() === query.Familia)
    if (query?.Tipo)
      items = items.filter(item => item.Tipo.toLowerCase() === query.Tipo)
    return items
  }

  async getInventoryItems(param = ""): Promise<[]> {
    const response = await fetch(API.URL + '/items/all').then(response => {
      return response.json()
    });
    console.log("Inventory Items: ", response)
    console.log(response)
    if (response['code'] == "api.success") return response['data']['value'];
  }

  async getItemInfo(idParte): Promise<[]> {
    const params = new URLSearchParams({ "idParte": idParte })
    const response = await fetch(API.URL + '/items/itemInfo?' + params).then(response => {
      return response.json()
    });

    console.log(response)
    if (response['code'] == "api.success") return response['data']['value'];
    return
  }

  async getAllItemsInfo(): Promise<[]> {
    const response = await fetch(API.URL + '/items/allitemInfo').then(response => {
      return response.json()
    });
    if (response['code'] == "api.success") return response['data']['value'];
  }

  async updateStatus(data): Promise<{}> {
    let props = {
      "id": data.idParte,
      "state": data.estado
    };
    const response = await fetch(API.URL + '/items/updateState', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    })

    if (response['code'] == "api.success") return response;

  }

  async disableItems(item):Promise<{}>{
    let props ={
        "item":item
    }
    const response = await fetch(API.URL+ '/items/downItem',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    })
    
    if (response['code'] == "api.success") return response;
  }
}
