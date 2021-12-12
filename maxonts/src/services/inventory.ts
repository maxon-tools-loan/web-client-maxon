import { url } from "inspector";
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

  async getMaintenanceItems(pageTools?,pageConsumibles?){
    let props = {pageTools:pageTools, pageConsumibles:pageConsumibles, numberOfRecords:10}
    let url = new URL(API.URL + '/items/recordMaintenance')
    let params = {}
    for (const [key,value] of Object.entries(props)){
      if (value==undefined) continue
      params[key]=value
    }
    url.search = new URLSearchParams(params).toString()
    const response = await fetch(url).then( response => {return response.json()})
    if (response['code'] == "api.success") return response['data'];
  }

  async getInItems(pageActualC=undefined,pageActualT=undefined,items=10){
    let paramss = {pageTools: pageActualT,
      pageConsumibles: pageActualC,
      numberOfRecords: items}
      let params ={}
      for(const [key,value] of Object.entries(paramss)){
        if(value==undefined){
          continue
        }
        params[key]=value
      }
      let url = new URL(API.URL+'/items/recordIns')
      url.search = new URLSearchParams(params).toString();
    const response = await fetch(url).then( response => {return response.json()})
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

  async getOutItems(pageActualC=undefined,pageActualT=undefined,items=10,query?){
    let paramss = {pageTools: pageActualT,
      pageConsumibles: pageActualC,
      numberOfRecords: items,
      inicio : query?.startDate,
      final : query?.endDate
    }
      let params ={}
      for(const [key,value] of Object.entries(paramss)){
        if(value==undefined){
          continue
        }
        params[key]=value
      }
      let url = new URL(API.URL+'/items/recordOuts')
      url.search = new URLSearchParams(params).toString();
    const response = await fetch(url).then( res => {return res.json()})
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


  async getOrderInfo(item?,Familia?,pedido?,page?): Promise<[]> {
    let props ={
      idParte:item,
      familia:Familia,
      pedido:pedido,
      numberOfRecords:15,
      page:page
    }
    let params = {}
    for (const [key,value] of Object.entries(props) ){
        if(value == undefined) continue
        params[key]=value
    }
    let url = new URL(API.URL +'/items/orders')
    url.search = new URLSearchParams(params).toString()
    const response = await fetch(url).then(response => {
      return response.json()
    });
    console.log(response)
    if (response['code'] == "api.success") return response['data'];
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

  async getInventoryItems(param = "",page=0,query?): Promise<[]> {
    const paramss = {
      idParte : query?.idParte,
      tipo:query?.Tipo,
      familia:query?.Familia,
      disponible:query?.order,
      page:page,
      numberOfRecords:15
    }
    
    let url = new URL(API.URL + '/items/all')
    let params ={}
    for(const [key,value] of Object.entries(paramss)){
      if(value==undefined) continue
      params[key]=value
    }
    url.search = new URLSearchParams(params).toString()
    const response = await fetch(url).then(response => {
      return response.json()
    });
    console.log("Inventory Items: ", response)
    
    if (response['code'] == "api.success") return response['data'];
  }

  async getItemInfo(idParte): Promise<[]> {
    const params = new URLSearchParams({ "idParte": idParte })
    const response = await fetch(API.URL + '/items/itemInfo?' + params).then(response => {
      return response.json()
    });

    
    if (response['code'] == "api.success") return response['data'];
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

  async updateImage(data): Promise<{}> {
    let props = {
      "imagen": data.imagen,
      "idParte": data.idParte
    };
    const response = await fetch(API.URL + '/items/updateItemImage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    }).then(r=>r.json())
    console.log(response)
    if (response['data'] == "api.success") return response;

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
