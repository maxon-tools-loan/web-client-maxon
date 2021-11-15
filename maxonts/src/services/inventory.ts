import { sleep } from "../utils";
const fetch = require('node-fetch');
export interface IInventoryItem {
  partNo: number;
  family: string;
  name: string;
  minimum: number;
  maximum: number;
  loaned?: number;
  available: boolean;
}

const dummyInventory: IInventoryItem[] = [
  {
    partNo: 123,
    family: "Hello",
    name: "eqwieqw",
    minimum: 3,
    maximum: 5,
    loaned: 12321,
    available: false,
  },
  {
    partNo: 123,
    family: "Hello",
    name: "eqwieqw",
    minimum: 3,
    maximum: 5,
    available: false,
  },
  {
    partNo: 123,
    family: "Hello",
    name: "eqwieqw",
    minimum: 3,
    maximum: 5,
    loaned: 12321,
    available: false,
  },
];

export class InventoryService {


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
}
