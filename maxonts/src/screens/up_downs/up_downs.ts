import {inject} from "aurelia-framework"
import { InventoryService } from "services/inventory"
import { LoansService } from "services/loans"
import {Redirect, Router} from "aurelia-router"
@inject(LoansService,InventoryService)
export class Up_Downs {
    public up = true
    
    public ups = []
    public down = []

    public downData = {}
    private ids =[];
    private data = []
    

    private loan:LoansService
    private inventory:InventoryService
    private router:Router
    constructor(loan:LoansService,Inventory:InventoryService,rt:Router){
        this.loan = loan;
        this.inventory = Inventory;
        this.router = rt
        this.loadIdParte();
    }

    async loadIdParte(){
        let data =await this.inventory.getAllItemsInfo()
        console.log(data)
        this.data = data
        data.forEach(element => {
            this.ids.push(element['idParte'])
            this.downData[element['idParte']] = element;
        });
    }
    matchData(i){
        console.log("EXECUTED")
        if(this.ids.includes(this.down[i]['idParte'])){
        this.down[i]['Familia'] = this.downData[this.down[i]['idParte']]['Familia'];
        this.down[i]['Descripcion'] = this.downData[this.down[i]['idParte']]['Descripcion'];
        }
        else{
            alert("No coinciden los datos")
        }
    }

    private addUp(){
        this.ups.push(Item())
    }
    private addDown(){
        this.down.push(Item())
    }
    private removeUp(i){
        if (i > -1) {
            this.ups.splice(i, 1);
          }
    }
    private removeDown(i){
        if (i > -1) {
            this.down.splice(i, 1);
          }
    }
    

    private verifyData(){
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
        "ALERT COnfirmacion"
        if(this.verifyData()){
            this.inventory.registerItems(this.ups);
            "ALTERR DE DECIR SISI YA SE HIZO COMMIT"
            this.ups =[]
        }else{
            "TODO ALERT"
        }

        
    }
    verifyDown(){
        console.log("EXECUTED")
        this.down.forEach(element=>{
            if(!this.ids.includes(element['idParte'])) {
                alert(`${element.idParte} No existe en la DB`)
                return false;
            }
        })
        return true;
    }
    async commitDown(){

        "ALERT COnfirmacion"
        console.log("EXECUTED")
        if(this.verifyDown()){
           await  this.inventory.disableItems(this.down);
           "ALERT DE DECIR SISI YA SE HIZO COMMIT"
          this.down =[]
          
        }
        else{
            "TODO ALERT"
           alert("No existe el coso");
        }
    }
    
}

function Item(){
    return{
        "idParte":"",
        "Familia":"",
        "Descripcion":"",
        "Seccion":"",
        "Minimo":"",
        "Maximo":"",
        "Image":null
    }
}


export class FileListToArrayValueConverter {
    toView(fileList) {
      let files = [];
      if (!fileList) {
        return files;
      }
      for(let i = 0; i < fileList.length; i++) {
        files.push(fileList.item(i));
      }
      return files;
    }
  }

  export class BlobToUrlValueConverter {
    toView(blob) {
      return URL.createObjectURL(blob);
    }
  }

