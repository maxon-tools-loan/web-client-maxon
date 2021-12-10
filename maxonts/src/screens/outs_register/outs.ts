import {inject} from "aurelia-framework"
import { InventoryService } from "services/inventory"
import {Router, Redirect} from "aurelia-router"
import * as moment from "moment";

@inject(InventoryService, Router)
export class outs_register{
    private moment =moment
    private actualPagetools:number=0
    private actualPageConsumibles:number=0
    private maxPagetools:number
    private maxPageConsumibles:number
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
       let data
        if(type==1 ){
            console.log("EXECUTED")
            console.log(this.actualPageConsumibles)
            
            if(this.titulo=='Registro de Salidas'){
                data =await this.service.getOutItems(this.actualPageConsumibles,undefined,10);
            }
            else{
                data =await this.service.getInItems(this.actualPageConsumibles,undefined,10);
            }
            this.consumibles = data['consumibles']
            this.maxPageConsumibles=data['pageConsumibles']
        }
        else{
            console.log("EXECUTED")
        
            if(this.titulo=='Registro de Salidas'){
                
            data =await this.service.getOutItems(undefined,this.actualPagetools,10);
            }
            else{
                data =await this.service.getInItems(undefined,this.actualPagetools,10);
            }
            this.tools = data['tools']
            this.maxPagetools=data['pageTools']
        }
    }

    async pagination(type:number,movement:number){
        
        if(type==1){
            if(movement==1 && this.maxPageConsumibles-1 >this.actualPageConsumibles){
            this.actualPageConsumibles=(this.actualPageConsumibles+1)
            await this.updatePage(type)
        }
            else if(movement==0 && 0<this.actualPageConsumibles){
            this.actualPageConsumibles=(this.actualPageConsumibles-1)
            await this.updatePage(type)
        }
            
        }
        else{
            if(movement==1 && this.actualPagetools <this.maxPagetools-1){
               
            this.actualPagetools=(this.actualPagetools+1)
            await this.updatePage(type)}
            else if(movement==0 && this.actualPagetools >0) {
            this.actualPagetools=(this.actualPagetools-1)
            await this.updatePage(type)}
            
        }
        
    }

    async changeData(){
        if (this.titulo=='Registro de Salidas'){
            this.titulo ='Registro de Entradas'
           
            
            let data =await this.service.getInItems();
            console.log("registroENTRADA")
            console.log(data)
            this.tools =data['tools']
            this.consumibles = data['consumibles']
            this.maxPagetools= data['pageTools']
            this.maxPageConsumibles = data['pageConsumibles']

        }
        else{
            this.titulo='Registro de Salidas'
            let data =await this.service.getOutItems();
            console.log("registroSALIDA")
            console.log(data)
            this.tools =data['tools']
            this.consumibles = data['consumibles']
            this.maxPagetools= data['pageTools']
            this.maxPageConsumibles = data['pageConsumibles']
        }
       
    }
    async setUp(){
        let data =await this.service.getOutItems();
        console.log(data)
        this.rawTools =data['tools']
        this.rawConsumibles = data['consumibles']
        this.tools = this.rawTools.slice(0,10)
        this.consumibles = this.rawConsumibles.slice(0,10)
        this.actualPageConsumibles =0
        this.actualPagetools=0
        this.maxPagetools =data['pageTools']
        this.maxPageConsumibles=data['pageConsumibles']
        console.log(this.maxPageConsumibles,this.maxPagetools)
        
    }

    redirect(){
        new Redirect('/registerInOuts').navigate(this.router)
    }
    
}