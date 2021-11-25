import { SWAL_EMPTY_MAINTENANCE, SWAL_INCORRECT_INPUT } from './../../swals/error';
import { inject } from "aurelia-framework"
import { InventoryService } from "services/inventory"
import { LoansService } from "services/loans"
import Swal from 'sweetalert2'

@inject(InventoryService, LoansService)
export class Maintenance {
  public consumibles = []
  public tools = []


  private validParts = []
  private validUsers = []
  private validConsumibles = []
  private validHerramientas = []
  private dictHerramientas = {}
  private dictConsumibles = {}

  NombresDeConsumibles = []
  matchesConsumibles = []
  matchesIdConsumibles = []

  NombresDeHerramientas = []
  matchesHerramientas = []
  matchesIdHerramientas = []

  fullDataConsumibles = []
  fullDataHerramientas = []

  ConsumibleSelected = null
  IDConsumibleSelected = null

  HerramientaSelected = null
  IDHerramientaSelected = null

  private meta = {
    "usuario": "394fbaab64153b5b0db2344c7e1bc7"
  }
  private service: InventoryService
  private loan: LoansService
  private opt = 1

  constructor(service: InventoryService, loan: LoansService) {
    this.service = service;
    this.loan = loan;
    this.getInfo();
  }



  AddCustom(i) {
    if (i) {
      this.consumibles.push(
        {
          "idParte": this.ConsumibleSelected,
          "idConsumible": this.IDConsumibleSelected,
          'cantidad': 1,
          'comentario': '',
          'area': '',

        }
      )
    }
    else {
      this.tools.push({
        "idHerramienta": this.IDHerramientaSelected,
        "idParte": this.HerramientaSelected,
        'comentario': '',
        'area': ''
      })

    }
  }

  matchParte(i,name){
   
    if(i==1){
      this.matchesConsumibles=[]
      this.fullDataConsumibles.forEach(element => {
        if(element['Descripcion']==name){
          this.matchesConsumibles.push(element['idParte'])
        }
        
      });
    }
    else{
      this.matchesHerramientas=[]
      this.fullDataHerramientas.forEach(element => {
        if(element['Descripcion']==name){
          this.matchesHerramientas.push(element['idParte'])
        }
        
      });
    }
  }
  matchId(i,name){
    console.log(i,name)
    if(i==1){
      this.matchesIdConsumibles=[]
      for (const [key, value] of Object.entries(this.dictConsumibles)) {
        if(value == name){
          this.matchesIdConsumibles.push(key.toString())
        }
      }
    }
    else{
      this.matchesIdHerramientas=[]
      for (const [key, value] of Object.entries(this.dictHerramientas)) {
        if(value == name){
          this.matchesIdHerramientas.push(key.toString())
        }
      }
    }
  }

  private verifyData() {
    let valid = true
    this.consumibles.forEach(element => {
      console.log(element)
      if (element.idConsumible === "")
        valid = valid && false
      if (!this.validConsumibles.includes(element['idConsumible'])) {
        valid = valid && false;
      }
    });

    this.tools.forEach(element => {
      console.log("tool", element)
      if (element.idHerramienta === "")
        valid = valid && false
      if (!this.validHerramientas.includes(element['idHerramienta'])) {
        valid = valid && false;
      }
    });
    return valid
  }

  async getInfo() {
    let data = await this.loan.getBasicData();

    let descs = await this.loan.getConsumiblesAndTools();
  
    descs['tools'].forEach(element => {
      this.NombresDeHerramientas.push(element['Descripcion'])
    });
    descs['consumibles'].forEach(element => {
      this.NombresDeConsumibles.push(element['Descripcion'])
    });
    this.fullDataConsumibles = descs['consumibles']
    this.fullDataHerramientas = descs['tools']

    data['items'].forEach(element => {
      this.validParts.push(element['idParte'])
    });
    data['empleados'].forEach(element => {
      this.validUsers.push(element['idEmpleado'])
    });
    data['tools'].forEach(element => {
      this.validHerramientas.push(element['idHerramienta'])
      this.dictHerramientas[element['idHerramienta']] = element['idParte']
    });
    data['consumibles'].forEach(element => {
      this.validConsumibles.push(element['idConsumible'])
      this.dictConsumibles[element['idConsumible']] = element['idParte']
    });
    console.log(this.dictConsumibles)
  }

  private updateData(i, type) {
    console.log(i, type)
    if (type == 0) {
      this.tools[i]['idParte'] = this.dictHerramientas[this.tools[i]['idHerramienta']]
    }
    else {
      this.consumibles[i]['idParte'] = this.dictConsumibles[this.consumibles[i]['idConsumible']]
    }

  }

  private commit() {
    if (this.tools.length === 0 && this.consumibles.length === 0)
      return Swal.fire(SWAL_EMPTY_MAINTENANCE)

    if (this.verifyData()) {
      this.service.registerManteinance(this.tools, this.consumibles, this.meta)
    }
    else {
      return Swal.fire(SWAL_INCORRECT_INPUT)
    }

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
}

function consu(index) {
  const information = {
    'idConsumible': '',
    'idParte': '',
    'cantidad': 1,
    'comentario': '',
    'area': '',
    'index': index,
  }
  return information
}

function tool(index) {
  const information = {
    'idHerramienta': '',
    'idParte': '',
    'comentario': '',
    'area': '',
    'index': index,
  }
  return information
}
