import { Router, Redirect } from 'aurelia-router';
import {  InventoryService } from "../../services/inventory"
import { inject } from "aurelia-framework"
import { createCipheriv } from "crypto";
import { SessionService } from "services/session";

const sorters = {
  ascending: (prop) => (a, b) => a[prop] - b[prop],
  descending: (prop) => (a, b) => b[prop] - a[prop]
}

@inject(InventoryService, SessionService, Router) 
export class Inventory {

  private inventoryService: InventoryService;
  private sessionService: SessionService;
  private items = []
  private rawItems = []
  private query = {}
  private currentQuery ={}
  private sorts = {}
  private families = []
  private types = []
  private page :number = 0
  private maxPage=null

  private getSHA = function (input) {
    const algorithm = "aes-256-cbc";

    // generate 16 bytes of random data
    const initVector = "0123456789012345"
    // secret key generate 32 bytes of random data
    const Securitykey = "01234567890123456789012345678901";

    // the cipher function
    const cipher = createCipheriv(algorithm, Securitykey, initVector);


    let encryptedData = cipher.update(input, "utf-8", "hex");

    encryptedData += cipher.final("hex");
    return encryptedData;
  }
  constructor(inventory: InventoryService, sessionService: SessionService,rt:Router){
    if (!sessionService.hasPermission('dashboard.read.inventory'))
      new Redirect('/auth/login').navigate(rt)
    this.sessionService = sessionService;

    this.inventoryService = inventory;
    this.setup()
  }
  async next(){
    if(this.page<this.maxPage-1){
      console.log()
    this.page +=1
    let data = await  this.inventoryService.getInventoryItems('',this.page,this.currentQuery);
    data['value'].forEach(element => {
      element["hash"] = this.getSHA(element['idParte'])
    });
    this.items= data['value']
    this.maxPage= data['pages']
    
    }
  }
  async previous(){
    if(this.page>0)
    this.page -=1
    let data = await  this.inventoryService.getInventoryItems('',this.page,this.currentQuery);
    data['value'].forEach(element => {
      element["hash"] = this.getSHA(element['idParte'])
    });
    this.items= data['value']
    this.maxPage= data['pages']
    
  }

  async setup() {
    let data = await this.inventoryService.getInventoryItems();
    data['value'].forEach(element => {
      element["hash"] = this.getSHA(element['idParte'])
    });
    this.items= data['value']
    this.maxPage= data['pages']
    this.families = Array.from(new Set(this.rawItems.map(v => v.Familia.toLowerCase())))
    this.types = ["Herramienta","Consumible"];  
    
    
  }

  async search(): Promise<void> {
    this.currentQuery =this.query

    let data = await this.inventoryService.getInventoryItems('',this.page,this.currentQuery);
    data['value'].forEach(element => {
      element["hash"] = this.getSHA(element['idParte'])
    });
    this.items =data['value']
    console.log(this.items)
    this.maxPage = data['pages']
    
 
  }

  

  

  private capitalize(v) {
    return v[0].toUpperCase() + v.slice(1).toLowerCase()
  }

  private amount(v) {
    return v ?? 0
  }

}

