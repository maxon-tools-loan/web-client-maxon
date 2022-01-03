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
  private types = ["Consumible","Herramienta"]
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
  ///Constructor de la clase y verificacion de permisos
  constructor(inventory: InventoryService, sessionService: SessionService,rt:Router){
    if (!sessionService.hasPermission('dashboard.read.inventory'))
      new Redirect('/auth/login').navigate(rt)
    this.sessionService = sessionService;

    this.inventoryService = inventory;
    this.setup()
  }

  //Actualizar los datos y buscar la siguiente pagina
  async next(){
    if(this.page<this.maxPage-1){
      //console.log()
    this.page +=1
    let data = await  this.inventoryService.getInventoryItems('',this.page,this.currentQuery);
    data['value'].forEach(element => {
      element["hash"] = this.getSHA(element['idParte'])
    });
    this.items= data['value']
    this.maxPage= data['pages']
    
    }
  }
  //Actualizar los datos y buscar la  pagina anterior
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
 //Obtener todos los datos necesarios o de la pagiuna inicial y cargarlas a memoria
  async setup() {
    let data = await this.inventoryService.getInventoryItems();
    data['value'].forEach(element => {
      element["hash"] = this.getSHA(element['idParte'])
    });
    this.items= data['value']
    this.maxPage= data['pages']

    //console.log(data)
    this.families = data['familias']
    this.types = ["Herramienta","Consumible"];  
    
    
  }

  ///Aplicar filtros sobre la busqueda
  async search(): Promise<void> {
    this.currentQuery =this.query
    this.page=0
    let data = await this.inventoryService.getInventoryItems('',this.page,this.currentQuery);
    data['value'].forEach(element => {
      element["hash"] = this.getSHA(element['idParte'])
    });
    this.items =data['value']
    //console.log(this.items)
    this.maxPage = data['pages']
    
 
  }

  

  

  private capitalize(v) {
    return v[0].toUpperCase() + v.slice(1).toLowerCase()
  }

  private amount(v) {
    return v ?? 0
  }

}

