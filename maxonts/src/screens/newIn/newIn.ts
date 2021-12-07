import { inject } from "aurelia-framework"
import { InventoryService } from "services/inventory";
import { LoansService } from "services/loans";
import { SWAL_ERROR } from "swals/error";
import { SWAL_INS_CONFIRM, SWAL_OUTS_CONFIRM, SWAL_SUCCESS, SWAL_UPS_CONFIRM } from "swals/question";
import Swal from "sweetalert2";
import {Redirect, Router} from 'aurelia-router';


@inject(LoansService, InventoryService,Router)
export class NewIns {
  public type = 0;
  public consumibles = []
  public tools = []
  private opt = 1
  private name = "Entrada"
  private options = [
    {
      "name": "Entrada",
      "valor": 0
    },
    {
      "name": "Salida",
      "valor": 1
    }
  ]

  meta = {
    'user': '394fbaab64153b5b0db2344c7e1bc7'
  }
  service: LoansService
  inventory: InventoryService
  constructor(serv: LoansService, invent: InventoryService,rt:Router) {
    this.service = serv
    this.inventory = invent
    this.router=rt
    this.setUp()
  }

  ElementSelected =null
  Selected =null
  dictAvailable = {}
  dictTotal = {}
  optionsAvailable = []

  matches = []

  ids =[]

  router:Router
  async setUp() {
    let data =await this.inventory.getItemsNotRegistered()
    console.log(data)
    
    for (const element of data.items){
        this.dictAvailable[element.Descripcion] = element.idParte
        this.optionsAvailable.push(element.Descripcion)
    }
    this.dictTotal = this.dictAvailable
    for (const element of data.ids){
        this.ids.push(element.id)
    }


  }

  AddCustom() {
    if (this.opt) {
      this.consumibles.push(
        {
          "idParte": this.ElementSelected,
          "idConsumible": '',
          "cantidad": 1,

        }
      )
    }
    else {
     
      this.tools.push({
        "idHerramienta":'',
        "idParte":  this.ElementSelected
      })

    }
    
    this.optionsAvailable = this.optionsAvailable.filter( item => item!=this.Selected)
    this.ElementSelected =null
  }
  
  matchParte(name) {
      this.matches.push(this.dictAvailable[name])

  }
 

  private getName() {
    this.name = this.options[this.type].name
  }
  private addConsumible() {
    this.consumibles.push(consu(this.consumibles.length))
  }
  private addTool() {
    this.tools.push(tool(this.tools.length))
  }
  private removeTool(index) {
    console.log(index)
    if (index > -1) {
      this.tools.splice(index, 1);
    }
  }
  private removeConsu(index) {
    console.log(index)
    if (index > -1) {
      this.consumibles.splice(index, 1);
    }
  }
  private addElement() {
    if (this.opt == 1) {
      this.addConsumible();
      console.log(this.consumibles)
    }
    else {
      this.addTool();
      console.log(this.tools);
    }
  }

  private verifyData() {

    for (const value of this.tools){
        if (value.idHerramienta ==null || value.idHerramienta=='' || value.marca=='' || value.marca ==null){
            return false
        }
        if(!Object.values(this.dictAvailable).includes(value.idParte)){
            return  false;
        }
        if(this.ids.includes(value.idConsumible)){
            return  false;
        }
    }
    for (const value of this.consumibles){
        if(!Object.values(this.dictAvailable).includes(value.idParte)){
            return  false;
        }
        if(this.ids.includes(value.idConsumible)){
            return  false;
        }
        if (value.idConsumible ==null || value.idConsumible=='' || value.marca=='' || value.marca ==null){
            return false
        }
    }
    return true
  }

  
  private async commit() {
    
      if (await this.verifyData() == true) {
        let res = await Swal.fire(SWAL_INS_CONFIRM)
        if (res.isConfirmed) {
          let res = await this.inventory.entryItem(this.tools, this.consumibles, this.meta)
          if (res.data == 'api.success') {
            await Swal.fire(SWAL_SUCCESS)
          }
          else {
            await Swal.fire(SWAL_ERROR)
          }
          this.consumibles = []
          this.tools = []
          this.setUp()
        }

      }
      else {
        await Swal.fire(SWAL_ERROR)
      }
    }
  }



function consu(index) {
  const information = {
    'idConsumible': '',
    'idParte': '',
    'cantidad': 1,
    'index': index,
  }
  return information
}

function tool(index) {
  const information = {
    'idHerramienta': '',
    'idParte': '',
    'marca': '',
    'index': index,
  }
  return information
}
