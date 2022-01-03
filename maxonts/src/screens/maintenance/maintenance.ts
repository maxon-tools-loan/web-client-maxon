import { SessionService } from 'services/session';
import { SWAL_EMPTY_MAINTENANCE, SWAL_INCORRECT_INPUT, SWAL_CANCELLED, SWAL_ERROR, getErrorSwal } from './../../swals/error';
import { SWAL_MAINTENANCE_CONFIRM, SWAL_SUCCESS} from './../../swals/question';
import { inject } from "aurelia-framework"
import { InventoryService } from "services/inventory"
import { LoansService } from "services/loans"
import Swal from 'sweetalert2'
import {Redirect, Router} from "aurelia-router"

@inject(InventoryService, LoansService, SessionService, Router)
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
  router:Router
  private meta = {
    "user": ""
  }
  private service: InventoryService
  private loan: LoansService
  private opt = 1
///Verificacion de permisos y cargar los servicos necesarios
  constructor(service: InventoryService, loan: LoansService, session: SessionService,rt:Router){
    if (!session.hasPermission('dashboard.read.maintenance'))
      new Redirect('/auth/login').navigate(rt)
    this.meta.user = session.getFullSession().user.username
    this.service = service;
    this.loan = loan;
    this.router=rt;
    this.getInfo();
  }


/// Agregar elementos para su mantenimiento
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

  //Hacer match entre la descripcion y el numero de parte del objeto
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
  // hacer un amtch entre el numero del objeto y su numero de ID  de herramienta o consumible
  matchId(i,name){
    //console.log(i,name)
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

  //Verificar la integridad de los datos a la hora de registrar mantenimiento
  private async verifyData() {
    let valid = true
    this.consumibles.forEach(element => {
      //console.log(element)
      if (element.idConsumible === "")
        valid = valid && false
      if (!this.validConsumibles.includes(element['idConsumible'])) {
        valid = valid && false;
      }
    });

    for (const element of this.consumibles){
      if(element.area=='' || element.area==null){
        await Swal.fire(getErrorSwal("Area no debe estar vacio"))
        return false
      }
    }

    for (const element of this.tools){
      if(element.area=='' || element.area==null){
        await Swal.fire(getErrorSwal("Area no debe estar vacio"))
        return false
      }
    }

    this.tools.forEach(element => {
      //console.log("tool", element)
      if (element.idHerramienta === "")
        valid = valid && false
      if (!this.validHerramientas.includes(element['idHerramienta'])) {
        valid = valid && false;
      }
    });
    return valid
  }


  //Obtener informacion basica acerca de los elementos para el autocompletado de datos
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
    //console.log(this.dictConsumibles)
  }

  //Atualizar los datos en funcion del numero de herramienta o consumible introducido
  private updateData(i, type) {
    //console.log(i, type)
    if (type == 0) {
      this.tools[i]['idParte'] = this.dictHerramientas[this.tools[i]['idHerramienta']]
    }
    else {
      this.consumibles[i]['idParte'] = this.dictConsumibles[this.consumibles[i]['idConsumible']]
    }

  }

  ///// Guardar y registrar los prestamos 
  private async commit() {
    
    const result = await Swal.fire(SWAL_MAINTENANCE_CONFIRM)
    if (!result){
      Swal.fire(SWAL_CANCELLED)
      return
    }
  

    
    if (this.tools.length === 0 && this.consumibles.length === 0)
      return Swal.fire(SWAL_EMPTY_MAINTENANCE)

    if (await this.verifyData()) {
      const response = await this.service.registerManteinance(this.tools, this.consumibles, this.meta)
      //console.log(response)
      if (response.data == "api.success")
        Swal.fire(SWAL_SUCCESS)
      else 
        Swal.fire(SWAL_ERROR)
      this.tools=[]
      this.consumibles=[]
    }
    else {
      return Swal.fire(SWAL_INCORRECT_INPUT)
    }

  }
  //Agregar consumible a la lista de consumibles
  private addConsumible() {
    this.consumibles.push(consu(this.consumibles.length))
  }
  //Agregar herramienta a la lista de herrramientas
  private addTool() {
    this.tools.push(tool(this.tools.length))
  }
  //Eliminar herramienta de la lista
  private removeTool(index) {
    //console.log(index)
    if (index > -1) {
      this.tools.splice(index, 1);
    }
  }
  //Eliminar Consumible de la lista
  private removeConsu(index) {
    //console.log(index)
    if (index > -1) {
      this.consumibles.splice(index, 1);
    }
  }
  //Agregar elemento en blkanco a la lista
  private addElement() {
    if (this.opt == 1) {
      this.addConsumible();
      //console.log(this.consumibles)
    }
    else {
      this.addTool();
      //console.log(this.tools);
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
