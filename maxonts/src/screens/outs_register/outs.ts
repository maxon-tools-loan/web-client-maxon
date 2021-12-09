import {inject} from "aurelia-framework"
import { InventoryService } from "services/inventory"
import {Router, Redirect} from "aurelia-router"
import * as moment from "moment";

@inject(InventoryService, Router)
export class outs_register{
    private moment =moment
    private actualPagetools:number
    private actualPageConsumibles:number
    titulo = "Registro de Salidas"
    rawTools =[]
    rawConsumibles =[]
    tools =[]
    consumibles =[]
    service:InventoryService
    router:Router
    constructor(service:InventoryService, rt:Router){
        this.service = service
        this.router = rt
        this.setUp()
    }
    
    async updatePage(type){
       
        if(type==1){
            console.log("EXECUTED")
            console.log(this.actualPageConsumibles)
            this.consumibles = this.rawConsumibles.slice(-10 + this.actualPageConsumibles*10,this.actualPageConsumibles*10 )
        }
        else{
            console.log("EXECUTED")
            console.log(this.actualPagetools)
            this.tools = this.rawTools.slice(-10 + this.actualPagetools*10,this.actualPagetools*10 )
        }
    }

    async pagination(type:number,movement:number){
        
        if(type==1){
            if(movement==1){
            this.actualPageConsumibles=(this.actualPageConsumibles+1)}
            else{
            this.actualPageConsumibles=(this.actualPageConsumibles-1)}
        }
        else{
            if(movement==1){
               
            this.actualPagetools=(this.actualPagetools+1)}
            else{
            this.actualPagetools=(this.actualPagetools-1)}
        }
        await this.updatePage(type)
    }

    async changeData(){
        if (this.titulo=='Registro de Salidas'){
            this.titulo ='Registro de Entradas'
           
            
            let data =await this.service.getInItems();
            console.log("registroENTRADA")
            console.log(data)
            this.rawTools =data['tools']
            this.rawConsumibles = data['consumibles']

        }
        else{
            this.titulo='Registro de Salidas'
            let data =await this.service.getOutItems();
            
            this.rawTools =data['tools']
            this.rawConsumibles = data['consumibles']
        }
        this.tools = this.rawTools.slice(0,10)
        this.consumibles = this.rawConsumibles.slice(0,10)
    }
    async setUp(){
        let data =await this.service.getOutItems();
        console.log(data)
        this.rawTools =data['tools']
        this.rawConsumibles = data['consumibles']
        this.tools = this.rawTools.slice(0,10)
        this.consumibles = this.rawConsumibles.slice(0,10)
        this.actualPageConsumibles =1
        this.actualPagetools=1
    }

    redirect(){
        new Redirect('/registerInOuts').navigate(this.router)
    }
    
}