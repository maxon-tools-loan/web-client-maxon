import { inject } from "aurelia-framework"
import { LoansService } from "services/loans"

@inject(LoansService)
export class Loans {
    validParts = []
    validUsers = []
    validConsumibles = []
    validHerramientas = []
    empleado = ""
    job = null
    maquina = null
    consumibles = []
    herramientas = []
    service: LoansService
    constructor(service: LoansService) {
        this.service = service;
        this.getInfo();
    }

    postLoan() {
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
        });
        data['consumibles'].forEach(element => {
            this.validConsumibles.push(element['idConsumible'])
        });
        console.log(data)
    }
    verifyData() {

        if (!this.validUsers.includes(this.empleado)) {
            
            console.log(this.validUsers)
            return false;
        }
        this.herramientas.forEach(element => {
            if (!this.validHerramientas.includes(element['idHerramienta'])) {
                return false
            }
            if (!this.validParts.includes(element['idParte'])) {
                return false
            }
        });
        this.consumibles.forEach(element => {
            if (!this.validConsumibles.includes(element['idConsumible'])) {
                return false
            }
            if (!this.validParts.includes(element['idParte'])) {
                return false
            }

        });
        return true
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
        if(this.verifyData()){
            let data ={
                "job":this.job,
                "maquina":this.maquina,
                "empleado":this.empleado,
                "user":"admin"
            }
            this.service.postLoan(this.herramientas,this.consumibles,data)
        }
        else{
            alert("Datos Incorrects")
            console.log("Incorrect Data")
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
            "cantidad": 1,
            "condicion": 0,
        }
    }

    dummyHerramienta() {
        return {
            "idPieza": "",
            "idParte": ""
        }
    }

}
