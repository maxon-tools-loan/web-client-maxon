import {inject} from "aurelia-framework"
import { InventoryService } from "services/inventory";
import * as moment from "moment";
import {Router,Redirect} from "aurelia-router"
import Swal from "sweetalert2";
import { confirmChangeMaintenance, SWAL_SUCCESS } from "swals/question";
import { SWAL_ERROR } from "swals/error";


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
    let result = await Swal.fire(confirmChangeMaintenance(item.idMantenimiento,this.mapStatus(item.completo),this.mapStatus(item.completo==1? 0: 1)))
    if(result.isConfirmed){
        if(item['completo'] ==1){
            item['completo']=0
        }
        else{
            item['completo']=1
        }
       
        let res = await this.service.updateMaintenance(item)
        if(res.code=='api.success'){
            Swal.fire(SWAL_SUCCESS)
        }
        else{
            Swal.fire(SWAL_ERROR)
        }
        }
    }
    private Register(){
        new Redirect('/maintenance').navigate(this.router)
    }

}