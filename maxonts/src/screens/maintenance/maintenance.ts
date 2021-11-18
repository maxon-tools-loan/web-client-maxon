import {inject} from "aurelia-framework"
import { InventoryService } from "services/inventory"
import { LoansService } from "services/loans"
@inject(InventoryService, LoansService)
export class Maintenance {
    public consumibles =[]
    public tools = []
    

    validParts = []
    validUsers = []
    validConsumibles = []
    validHerramientas = []
    dictHerramientas ={}
    dictConsumibles ={}

    meta ={
        "usuario":"admin"
    }
    service:InventoryService
    loan:LoansService
    opt = 1
    
    constructor(service:InventoryService,loan:LoansService){
        this.service = service;
        this.loan = loan;
        this.getInfo();
        
    }

    verifyData(){
        this.consumibles.forEach(element => {
            if (!this.validConsumibles.includes(element['idConsumible'])) {
                return false;
            }
        });

        this.tools.forEach(element => {
            if (!this.validHerramientas.includes(element['idHerramienta'])) {
                return false;
            }
        });
        return true

    }

    async getInfo() {
        let data = await this.loan.getBasicData();
        data['items'].forEach(element => {
            this.validParts.push(element['idParte'])
        });
        data['empleados'].forEach(element => {
            this.validUsers.push(element['idEmpleado'])
        });
        data['tools'].forEach(element => {
            this.validHerramientas.push(element['idHerramienta'])
            this.dictHerramientas[element['idHerramienta']]=element['idParte']
        });
        data['consumibles'].forEach(element => {
            this.validConsumibles.push(element['idConsumible'])
            this.dictConsumibles[element['idConsumible']]=element['idParte']
        });
        console.log(this.dictConsumibles)
    }

    updateData(i,type){
        console.log(i,type)
        if(type==0){
            this.tools[i]['idParte'] = this.dictHerramientas[this.tools[i]['idHerramienta']]
        }
        else{
            this.consumibles[i]['idParte'] = this.dictConsumibles[this.consumibles[i]['idConsumible']]
        }

    }

    commit(){
        if(this.verifyData()){
            this.service.registerManteinance(this.tools,this.consumibles,this.meta)
        }
        else{
            alert("Datos Incorrectos");
        }
        
    }
    addConsumible(){
        this.consumibles.push(consu(this.consumibles.length))
    }
    addTool(){
        this.tools.push(tool(this.tools.length))
    }
    removeTool(index){
        console.log(index)
        if (index > -1) {
            this.tools.splice(index, 1);
          }
    }
    removeConsu(index){
        console.log(index)
        if (index > -1) {
            this.consumibles.splice(index, 1);
          }
    }
    addElement(){
        if(this.opt==1){
            this.addConsumible();
            console.log(this.consumibles)
        }
        else{
            this.addTool();
            console.log(this.tools);
        }
    }
}

function consu(index){
    const information ={
        'idConsumible':'',
        'idParte':'',
        'cantidad':1,
        'comentario':'',
        'area':'',
        'index':index,
    }
    return information
}

function tool(index){
    const information ={
        'idHerramienta':'',
        'idParte':'',
        'comentario':'',
        'area':'',
        'index':index,
    }
    return information
}