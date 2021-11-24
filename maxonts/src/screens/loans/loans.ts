import { SWAL_LOAN_MATERIAL_REMAINING, SWAL_EMPLOYEE_NOT_EXISTS, SWAL_INCORRECT_INPUT, SWAL_LOAN_NO_ELEMENTS } from './../../swals/error';
import Swal from 'sweetalert2';
import { inject } from "aurelia-framework"
import { LoansService } from "services/loans"


@inject(LoansService)
export class Loans {
  sacannerMode =false
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

  deudores = []
  constructor(service: LoansService) {
    this.service = service;
    this.getInfo();
  }

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
      console.log(this.HerramientaSelected,this.IDHerramientaSelected)
      this.herramientas.push({
        "idHerramienta": this.IDHerramientaSelected,
        "idParte": this.HerramientaSelected
      })
      console.log(this.herramientas)
    }
  }
  matchParte(i,name){
    this.matchesConsumibles=[]
    console.log(i,name)
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
    });
    data['tools'].forEach(element => {
      this.validHerramientas.push(element['idHerramienta'])
      this.dictHerramientas[element['idHerramienta']] = element['idParte']
    });
    data['consumibles'].forEach(element => {
      this.validConsumibles.push(element['idConsumible'])
      this.dictConsumibles[element['idConsumible']] = element['idParte']
    });
    let datas = await this.service.getLoans();
    datas['loans'].forEach(element => {
      this.deudores.push(element['idEmpleado'])
    });

  }
  updateData(i, type) {
    console.log(i, type)
    if (type == 0) {
      this.herramientas[i]['idParte'] = this.dictHerramientas[this.herramientas[i]['idHerramienta']]
    }
    else {
      this.consumibles[i]['idParte'] = this.dictConsumibles[this.consumibles[i]['idConsumible']]
    }

  }
  verifyData() {
    if (this.deudores.includes(parseInt(this.empleado))) {
      Swal.fire(SWAL_LOAN_MATERIAL_REMAINING)
      return false;
    }

    if (!this.validUsers.includes(parseInt(this.empleado))) {
      Swal.fire(SWAL_EMPLOYEE_NOT_EXISTS)
      return false;
    }

    let valid = true
    this.herramientas.forEach(element => {
      if (element == null || element == '') {
        valid = valid && false;
      }
      if (!this.validHerramientas.includes(element['idHerramienta'])) {
        valid = valid && false;
      }
      if (!this.validParts.includes(element['idParte'])) {
        valid = valid && false;
      }
    });
    this.consumibles.forEach(element => {
      if (element == null || element == '') {
        valid = valid && false;
      }
      if (!this.validConsumibles.includes(element['idConsumible'])) {
        valid = valid && false;
      }
      if (!this.validParts.includes(element['idParte'])) {
        valid = valid && false;
      }
    });
    Swal.fire(SWAL_INCORRECT_INPUT)
    return valid
  }
  add(value) {
    if (value == 1) {
      this.consumibles.push(this.dummyConsumible())
    }
    else {
      this.herramientas.push(this.dummyHerramienta())
    }
  }
  commit() {
    if (this.herramientas.length < 1 && this.consumibles.length < 1) {
      return Swal.fire(SWAL_LOAN_NO_ELEMENTS)
    }
    if (this.verifyData()) {
      let data = {
        "job": this.job,
        "maquina": this.maquina,
        "empleado": this.empleado,
        "user": "91b990e9fe9776c93017b2c451fef7",
        "externo": 0
      }
      this.service.postLoan(this.herramientas, this.consumibles, data)
    }
  }
  remove(i, value) {
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

  setcondition(i, val) {
    this.consumibles[i]['condicion'] = parseInt(val);
    console.log(i + val);
  }

  dummyConsumible() {
    return {
      "idParte": "",
      "idConsumible": "",
      "cantidad": 1,
      "condicion": 0
      
    }
  }

  dummyHerramienta() {
    return {
      "idHerramienta": "",
      "idParte": ""
    }
  }

}
