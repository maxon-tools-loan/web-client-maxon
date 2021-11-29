import {inject} from "aurelia-framework"
import { InventoryService } from "services/inventory"
import {Router, Redirect} from "aurelia-router"

@inject(InventoryService, Router)
export class outs_register{
    
    tools =[]
    consumibles =[]
    service:InventoryService
    router:Router
    constructor(service:InventoryService, rt:Router){
        this.service = service
        this.router = rt
        this.setUp()
    }

    async setUp(){
        let data =this.service.getOutItems;
        console.log(data)
        this.tools =data['tools']
        this.consumibles = data['consumibles']
    }

    redirect(){
        new Redirect('/registerInOuts').navigate(this.router)
    }
}