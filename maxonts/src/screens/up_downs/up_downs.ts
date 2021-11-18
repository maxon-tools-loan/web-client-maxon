import {inject} from "aurelia-framework"
import { InventoryService } from "services/inventory"
import { LoansService } from "services/loans"
@inject(LoansService,InventoryService)
export class Up_Downs {
    public up = true
    
    public ups = []
    public down = []

    public downData = {}
    ids =[];
    

    loan:LoansService
    inventory:InventoryService
    constructor(loan:LoansService,Inventory:InventoryService){
        this.loan = loan;
        this.inventory = Inventory;
    }

    async loadIdParte(){
        let data =await this.inventory.getAllItemsInfo()
        data['items'].forEach(element => {
            this.ids.push(element['idParte'])
            this.downData[element['idParte']] = element;
        });
    }
    matchData(i){
        this.down[i]['Familia'] = this.downData[this.down[i]['idParte']]['Familia']
    }

    addUp(){
        this.ups.push(Item())
    }
    addDown(){
        this.down.push(Item())
    }
    removeUp(i){
        if (i > -1) {
            this.ups.splice(i, 1);
          }
    }
    removeDown(i){
        if (i > -1) {
            this.down.splice(i, 1);
          }
    }
    verifyData(){
        this.ups.forEach(element=>{
            if(this.ids.includes(element['idParte'])) {
                alert(`${element.idParte} Ya existe Prueba con otro ID`)
                return false;
            }
        })
        for (let index = 0; index < this.ups.length -1; index++) {
            const element = this.ups[index].idParte;
            for (let idx = index +1 ; idx<this.ups.length; idx++){
                const comparable = this.ups[idx].idParte;
                if(comparable==element){
                    alert("El id de parte se repite en tus opciones")
                    return false;
                }

            }
            
        }


        return true;
    }
    async commit(){
        console.log('commiting')
        if(this.verifyData()){
            this.inventory.registerItems(this.ups);
        }

        
    }
    commitDown(){
        console.log("TBD")
    }
    
}

function Item(){
    return{
        "idParte":"",
        "Familia":"",
        "Descripcion":"",
        "Seccion":"",
        "Minimo":"",
        "Maximo":""
    }
}




