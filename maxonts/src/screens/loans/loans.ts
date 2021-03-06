import { SessionService } from 'services/session';
import { SWAL_LOAN_MATERIAL_REMAINING, SWAL_EMPLOYEE_NOT_EXISTS, SWAL_INCORRECT_INPUT, SWAL_LOAN_NO_ELEMENTS } from './../../swals/error';
import Swal from 'sweetalert2';
import { inject } from "aurelia-framework"
import { LoansService } from "services/loans"
import {Router, Redirect} from "aurelia-router"
import { SWAL_EMPLOYEE_DEBT } from 'swals/question';
@inject(LoansService, SessionService,Router)
export class Loans {
  
  validParts = []
  validUsers = []
  validConsumibles = []
  validHerramientas = []
  dictHerramientas = {}
  dictConsumibles = {}

  NombresDeConsumibles = []
  matchesConsumibles = []
  matchesIdConsumibles = []

  NombresDeHerramientas = []
  matchesHerramientas = []
  matchesIdHerramientas = []

  fullDataConsumibles =[]
  fullDataHerramientas =[]  

  empleado: string
  job = null
  maquina = null
  consumibles = []
  herramientas = []
  service: LoansService

  ConsumibleSelected =null
  IDConsumibleSelected = null

  HerramientaSelected=null
  IDHerramientaSelected=null

  limits ={}

  deudores = []
  router:Router
  empleados ={}
  match ={
    'area':null,
    'nombre':null
  }

   meta = {
    user:''
  
  }
  ///Verificacion de permisos y obtenecion de servicios  e informacion basica
  constructor(service: LoansService, session: SessionService,rt:Router){
    if (!session.hasPermission('dashboard.read.loans'))
      new Redirect('/auth/login').navigate(rt)

    this.meta.user = session.getFullSession().user.username
    //console.log(this.meta)
    this.service = service;
    this.router = rt;
    this.getInfo();
  }

   /// Seleccionar el area y el empleado a la que pertenece un empleado
  matchEmployee(){
    if(Object.keys(this.empleados).includes(this.meta['empleado'])){
    this.match.area = this.empleados[this.meta['empleado']].area
    this.match.nombre = this.empleados[this.meta['empleado']].nombre
    }
    else{
      this.match.area = null
      this.match.nombre = null
    }
    //console.log(this.match)
  }

  ///// A??adur consumibles y herramientas a memoria
  AddCustom(i){
    if(i){
      this.consumibles.push(
        {
          "idParte": this.ConsumibleSelected,
          "idConsumible":this.IDConsumibleSelected,
          "cantidad": 1,
          "condicion": 0
          
        }
      )
    }
    else{

      this.herramientas.push({
        "idHerramienta": this.IDHerramientaSelected,
        "idParte": this.HerramientaSelected
      })

    }
  }
  
  /// Hacer un march del nombre con el numero de parte
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

  ///Hacer un match entre elm nombre y el idParte
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

  //Registrar el prestamo
  postLoan() {
    this.service.postLoan(this.consumibles, this.herramientas, {});
  }
  async getInfo() {
    let data = await this.service.getBasicData();
    let descs = await this.service.getConsumiblesAndTools();
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
      this.empleados[element.idEmpleado] = element
    });
      data['tools'].forEach(element => {
        this.validHerramientas.push(element['idHerramienta'])
        this.dictHerramientas[element['idHerramienta']] = element['idParte']
      });
      data['consumibles'].forEach(element => {
        this.validConsumibles.push(element['idConsumible'])
        this.dictConsumibles[element['idConsumible']] = element['idParte']
        this.limits[element.idConsumible]=element['Disponible']
    });
    let datas = await this.service.getLoans('',0,'',);
    datas['loans'].forEach(element => {
      this.deudores.push(element['idEmpleado'])
    });

  }
  //Hacer un match entre el numero de parte basadois en el idHerramienta o consumible
  private updateData(i, type) {
    //console.log(i, type)
    if (type == 0) {
      this.herramientas[i]['idParte'] = this.dictHerramientas[this.herramientas[i]['idHerramienta']]
    }
    else {
      this.consumibles[i]['idParte'] = this.dictConsumibles[this.consumibles[i]['idConsumible']]
    }

  }


  ///Verificacion de los datos precio al commit de datos
  private async verifyData() {

      //Verificacion de que el empleado exista
      if (!this.validUsers.includes(parseInt(this.meta['empleado']))) {
        Swal.fire(SWAL_EMPLOYEE_NOT_EXISTS)
        //console.log("ERROR AQUI")
        return false;
      }

    ///Verificacion que el empleado al que se le presta material no deba tenga algun adeudo
    if (this.deudores.includes(parseInt(this.meta['empleado']))) {
      let result =await Swal.fire(SWAL_EMPLOYEE_DEBT)
      if(!result){
      return false;
      }
    }
  

    let valid = true
    ///Verifciacion de que las herramientas prestadas ecistan
    this.herramientas.forEach(element => {
      if (element == null || element == '') {
        valid =  false;
      }
      if (!this.validHerramientas.includes(element['idHerramienta'])) {
        valid =  false;
      }
      if (!this.validParts.includes(element['idParte'])) {
        valid =  false;
      }
    });
    //Verificar que los consumibles prestados existan
    this.consumibles.forEach(element => {
      if (element == null || element == '') {
        valid =  false;
      }
      if (!this.validConsumibles.includes(element['idConsumible'])) {
        valid =  false;
      }
      if (!this.validParts.includes(element['idParte'])) {
        valid = false;
      }
    });
    if(!valid){
      Swal.fire(SWAL_INCORRECT_INPUT)}
    return valid
  }
  //A??adir elementos a los consumibles
  private add(value) {
    if (value == 1) {
      this.consumibles.push(this.dummyConsumible())
    }
    else {
      this.herramientas.push(this.dummyHerramienta())
    }
  }
  //Registrar el prestamo de elementos y rediceccionar a la pagina de devoluciones
  private async commit() {
    if (this.herramientas.length < 1 && this.consumibles.length < 1) {
      return Swal.fire(SWAL_LOAN_NO_ELEMENTS)
    }
    if (await this.verifyData()) {
      
      let res = await this.service.postLoan(this.herramientas, this.consumibles, this.meta )

      new Redirect('/returns').navigate(this.router)
    }
  }
  //Eliminar elementos de la lista prestada
  private remove(i, value) {
    if (value == 1) {
      if (i > -1) {
        this.consumibles.splice(i, 1);
      }
    }
    else {
      if (i > -1) {
        this.herramientas.splice(i, 1);
      }
    }
  }

  //Actualizar la condicion en la que se presta un elemento
  private setcondition(i, val) {
    this.consumibles[i]['condicion'] = parseInt(val);
    //console.log(i + val);
  }

  
  private dummyConsumible() {
    return {
      "idParte": "",
      "idConsumible": "",
      "cantidad": 1,
      "condicion": 0
      
    }
  }

  private dummyHerramienta() {
    return {
      "idHerramienta": "",
      "idParte": ""
    }
  }

}
