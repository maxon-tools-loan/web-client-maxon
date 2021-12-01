import {inject} from "aurelia-framework"
import { InventoryService } from "services/inventory";
import * as moment from "moment";
import {Router,Redirect} from "aurelia-router"


@inject(InventoryService,Router)
export class MaintenanceRecord{
    moment = moment
    service:InventoryService
    consumibles =[]
    tools=[]
    router:Router
    constructor(serv:InventoryService,rt:Router){
        this.service = serv
        this.router=rt
        this.setUp()
    }
    async setUp(){
        let data = await this.service.getMaintenanceItems()
        this.consumibles =data['consumibles']
        this.tools = data['tools']
    }

    private mapStatus(statusId) {
        const existing = {
          0: "En Proceso",
          1: "Completado",
        }
        return existing[statusId] ?? statusId
      }
    

    async triggerSave(item){
    "TODO : SWAL QUE PREGUNTE PARA CAMBAIR EL ESTADO"
        if(item['completo'] ==1){
            item['completo']=0
        }
        else{
            item['completo']=1
        }
        alert("EL ITEM CAMBIARA DE ESTADO")
        this.service.updateMaintenance(item)
    }
    private Register(){
        new Redirect('/maintenance').navigate(this.router)
    }

}