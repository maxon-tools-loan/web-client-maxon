import { API } from "../../../config";
import { sleep } from "../utils";
const fetch = require('node-fetch');


export class InventoryService {

 
  async registerItems(items) {
    let props = {
      "items": items
    };
    const response = await fetch(API.URL + '/items/registerItem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props)
    })

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
    })

    return response;
  }


  async getOrderInfo(): Promise<[]> {
    const response = await fetch('http://localhost:3000/api/items/orders').then(response => {
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
    const response = await fetch('http://localhost:3000/api/items/itemInfo?' + params).then(response => {
      return response.json()
    });

    console.log(response)
    if (response['code'] == "api.success") return response['data']['value'];
    return
  }

  async getAllItemsInfo(): Promise<[]> {
    const response = await fetch(API.URL + 'items/allitemInfo').then(response => {
      return response.json()
    });
    if (response['code'] == "api.success") return response['data'];
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

    return response;

  }
}
