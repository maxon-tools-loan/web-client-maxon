import { inject } from "aurelia-framework"
import { InventoryService } from "services/inventory";
import * as moment from "moment";
import { Router, Redirect } from "aurelia-router"
import Swal from "sweetalert2";
import { confirmChangeMaintenance, SWAL_SUCCESS } from "swals/question";
import { SWAL_ERROR } from "swals/error";


@inject(InventoryService, Router)
export class MaintenanceRecord {
    moment = moment
    service: InventoryService
    consumibles = []
    tools = []
    router: Router
    maxTools=0
    maxConsumibles=0
    actTools=0
    actConsumibles=0

    ////Aplicar filtros y hacer la bsuqueda para la siguiente pagina de elementos en mantenimiento
    async next(tp){
        if(tp && this.actConsumibles < this.maxConsumibles-1){
            this.actConsumibles+=1
            let data = await this.service.getMaintenanceItems(undefined,this.actConsumibles)

        this.consumibles = data['consumibles']
        this.maxConsumibles = data['pageConsumibles']
        
        }
        else if(!tp && this.actTools < this.maxTools-1 ){
            this.actTools+=1
            let data = await this.service.getMaintenanceItems(this.actTools,undefined)
   
        this.maxTools = data['pageTools']
        this.tools = data['tools']
        }
    }
////Aplicar filtros y hacer la bsuqueda para la  pagina previa de elementos en mantenimiento
    async previous(tp){
        if(tp && this.actConsumibles >0 ){
            this.actConsumibles-=1
            let data = await this.service.getMaintenanceItems(undefined,this.actConsumibles)
            this.consumibles = data['consumibles']
            this.maxConsumibles = data['pageConsumibles']
   
        }
        else if(!tp && tp && this.actConsumibles >0) {
            this.actConsumibles-=1
            let data = await this.service.getMaintenanceItems(this.actTools,undefined)

            this.maxTools = data['pageTools']
            this.tools = data['tools']
        }
    }
    /// Constructor de las clase
    constructor(serv: InventoryService, rt: Router) {
        this.service = serv
        this.router = rt
        this.setUp()
    }

    ///Set up de los datos basicos de la aplciacion
    async setUp() {
        let data = await this.service.getMaintenanceItems()
        this.consumibles = data['consumibles']
        this.maxConsumibles = data['pageConsumibles']
        this.maxTools = data['pageTools']
       
        this.tools = data['tools']
    }
    /// Parsear de status a proceso
    private mapStatus(statusId) {
        const existing = {
            0: "En Proceso",
            1: "Completado",
        }
        return existing[statusId] ?? statusId
    }

    async triggerSave(item) {
        //// Confirmacion y registrar mantenimiento como completado
      
        let result = await Swal.fire(confirmChangeMaintenance(item.idMantenimiento, this.mapStatus(item.completo), this.mapStatus(item.completo == 1 ? 0 : 1)))
        if (result.isConfirmed) {
            if (item['completo'] == 1) {
                item['completo'] = 0
            }
            else {
                item['completo'] = 1
            }
            let res = await this.service.updateMaintenance(item)
            if (res.data == 'api.success') {
                Swal.fire(SWAL_SUCCESS)
            }
            else {
                Swal.fire(SWAL_ERROR)
            }
        }
    }
    private Register() {
        new Redirect('/maintenance').navigate(this.router)
    }

}