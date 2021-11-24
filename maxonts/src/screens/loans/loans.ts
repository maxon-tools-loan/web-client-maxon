import { SWAL_LOAN_MATERIAL_REMAINING, SWAL_EMPLOYEE_NOT_EXISTS, SWAL_INCORRECT_INPUT, SWAL_LOAN_NO_ELEMENTS } from './../../swals/error';
import Swal from 'sweetalert2';
import { inject } from "aurelia-framework"
import { LoansService } from "services/loans"


@inject(LoansService)
export class Loans {
  private validParts = []
  private validUsers = []
  private validConsumibles = []
  private validHerramientas = []
  private dictHerramientas = {}
  private dictConsumibles = {}
  private empleado: string
  private job = null
  private maquina = null
  private consumibles = []
  private herramientas = []
  private service: LoansService

  private deudores = []
  constructor(service: LoansService) {
    this.service = service;
    this.getInfo();
  }

  private postLoan() {
    this.service.postLoan(this.consumibles, this.herramientas, {});
  }
  async getInfo() {
    let data = await this.service.getBasicData();
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
  private updateData(i, type) {
    console.log(i, type)
    if (type == 0) {
      this.herramientas[i]['idParte'] = this.dictHerramientas[this.herramientas[i]['idHerramienta']]
    }
    else {
      this.consumibles[i]['idParte'] = this.dictConsumibles[this.consumibles[i]['idConsumible']]
    }

  }
  private verifyData() {
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
  private add(value) {
    if (value == 1) {
      this.consumibles.push(this.dummyConsumible())
    }
    else {
      this.herramientas.push(this.dummyHerramienta())
    }
  }
  private commit() {
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

  private setcondition(i, val) {
    this.consumibles[i]['condicion'] = parseInt(val);
    console.log(i + val);
  }

  private dummyConsumible() {
    return {
      "idParte": "",
      "idConsumible": "",
      "cantidad": 1,
      "condicion": 0,
    }
  }

  private dummyHerramienta() {
    return {
      "idHerramienta": "",
      "idParte": ""
    }
  }

}
