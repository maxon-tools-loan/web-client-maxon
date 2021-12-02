import {inject} from "aurelia-framework"
import { InventoryService } from "services/inventory";
import { LoansService } from "services/loans";

@inject(LoansService,InventoryService)
export class InOut {
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

    meta ={
      'user':'394fbaab64153b5b0db2344c7e1bc7'
    }
    service:LoansService
    inventory:InventoryService
    constructor(serv:LoansService, invent:InventoryService){
        this.service = serv
        this.inventory = invent
        this.setUp()
    }

    dictHerramientas = {}
    dictConsumibles = {}
    ConsumibleSelected = null
    IDConsumibleSelected = null

    HerramientaSelected = null
    IDHerramientaSelected = null

    NombresDeConsumibles = []
    matchesConsumibles = []
    matchesIdConsumibles = []
  
    NombresDeHerramientas = []
    matchesHerramientas = []
    matchesIdHerramientas = []
  
    fullDataConsumibles =[]
    fullDataHerramientas =[] 

    async setUp(){
        let data = await this.service.getConsumiblesAndTools()
        data['tools'].forEach(element => {
            this.NombresDeHerramientas.push(element['Descripcion'])
          });
          data['consumibles'].forEach(element => {
            this.NombresDeConsumibles.push(element['Descripcion'])
          });
          this.fullDataConsumibles = data['consumibles']
          this.fullDataHerramientas = data['tools']
          data = await this.service.getBasicData()
          data['tools'].forEach(element => {
            
            this.dictHerramientas[element['idHerramienta']] = element['idParte']
          });
          data['consumibles'].forEach(element => {
            this.dictConsumibles[element['idConsumible']] = element['idParte']})
    }

    AddCustom(i){
        if(i){
          this.consumibles.push(
            {
              "idParte": this.ConsumibleSelected,
              "idConsumible":this.IDConsumibleSelected,
              "cantidad": 1,
              
            }
          )
        }
        else{
          console.log(this.HerramientaSelected,this.IDHerramientaSelected)
          this.tools.push({
            "idHerramienta": this.IDHerramientaSelected,
            "idParte": this.HerramientaSelected
          })

        }
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

    private verifyData(){

    this.tools.forEach(element => {
        if (element['idParte'] == null || element['idParte'] == '' ){
          return false
        }
      });

      this.consumibles.forEach(element => {
        if (element['idParte'] == null || element['idParte'] == '' ){
          return false
        }
      });
      return true
    }

    private commit() {
        const type = (this.type) ? "Entrada" : "Salida"

        if (this.type) {
            console.log("Salida")
            
        }
        else {
            console.log("Entrada")
            if (this.verifyData()){
            this.inventory.entryItem(this.tools,this.consumibles,this.meta)
          }
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
